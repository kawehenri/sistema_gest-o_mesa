/** Chave de slot por hora (UTC local) para limite de reservas */
export function slotKeyFromIso(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:00`;
}

export function addMinutes(iso, minutes) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

export function intervalsOverlap(startA, endA, startB, endB) {
  const a0 = new Date(startA).getTime();
  const a1 = new Date(endA).getTime();
  const b0 = new Date(startB).getTime();
  const b1 = new Date(endB).getTime();
  return a0 < b1 && b0 < a1;
}

export function reservationEnd(reserva, slotDuracaoMin) {
  return addMinutes(reserva.inicioISO, reserva.duracaoMin ?? slotDuracaoMin);
}

/** Reservas que contam para o limite percentual no slot */
export function reservasAtivasNoSlot(reservas, slotKey, slotDuracaoMin) {
  return reservas.filter((r) => {
    if (["cancelada", "no_show", "concluida"].includes(r.status)) return false;
    return slotKeyFromIso(r.inicioISO) === slotKey;
  });
}

export function maxMesasReservaveis(mesasCount, percent) {
  if (mesasCount <= 0) return 0;
  return Math.max(1, Math.ceil((mesasCount * percent) / 100));
}

export function podeCriarReserva({
  mesas,
  reservas,
  inicioISO,
  maxReservaPercent,
  slotDuracaoMin,
}) {
  const sk = slotKeyFromIso(inicioISO);
  if (!sk) return { ok: false, motivo: "Data/hora inválida." };
  const ativas = reservasAtivasNoSlot(reservas, sk, slotDuracaoMin);
  const max = maxMesasReservaveis(mesas.length, maxReservaPercent);
  if (ativas.length >= max) {
    return {
      ok: false,
      motivo: `Limite de reservas para este horário atingido (${ativas.length}/${max} mesas reserváveis).`,
    };
  }
  return { ok: true, slotKey: sk, atual: ativas.length, max };
}

export function mesasCompativeis(mesas, pessoas) {
  return mesas
    .filter((m) => m.capacidade >= pessoas)
    .sort((a, b) => a.capacidade - b.capacidade);
}

/** Conflito se mesa já está comprometida por outra reserva com sobreposição */
export function conflitoMesaHorario({
  reservas,
  mesaId,
  inicioISO,
  duracaoMin,
  ignorarReservaId,
  slotDuracaoMin,
}) {
  const dur = duracaoMin ?? slotDuracaoMin;
  const fim = addMinutes(inicioISO, dur);
  return reservas.some((r) => {
    if (r.id === ignorarReservaId) return false;
    if (!r.mesaId || r.mesaId !== mesaId) return false;
    if (["cancelada", "no_show", "concluida"].includes(r.status)) return false;
    const rfim = reservationEnd(r, slotDuracaoMin);
    return intervalsOverlap(inicioISO, fim, r.inicioISO, rfim);
  });
}

export function podeAlocarMesa({
  reservas,
  mesaId,
  inicioISO,
  duracaoMin,
  ignorarReservaId,
  slotDuracaoMin,
}) {
  if (
    conflitoMesaHorario({
      reservas,
      mesaId,
      inicioISO,
      duracaoMin,
      ignorarReservaId,
      slotDuracaoMin,
    })
  ) {
    return { ok: false, motivo: "Mesa já possui reserva sobreposta neste horário." };
  }
  return { ok: true };
}

/** Atraso além da tolerância (minutos após início) */
export function minutosAtraso(inicioISO) {
  const diff = Date.now() - new Date(inicioISO).getTime();
  return Math.floor(diff / 60000);
}

export function toleranciaUltrapassada(inicioISO, toleranciaMin) {
  return minutosAtraso(inicioISO) > toleranciaMin;
}

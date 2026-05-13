import { dispatch, getState, subscribe, canUser } from "../state/store.js";
import { demoUsers } from "../state/seed.js";
import {
  podeCriarReserva,
  mesasCompativeis,
  podeAlocarMesa,
  toleranciaUltrapassada,
  minutosAtraso,
} from "../domain/rules.js";

let modal = null;
let appRoot = null;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDateTime(iso) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function setHash(route) {
  window.location.hash = `#${route}`;
}

function getRoute() {
  const h = window.location.hash.replace(/^#\/?/, "") || "dashboard";
  return h.split("?")[0];
}

function closeModal() {
  modal = null;
  if (appRoot) renderApp(appRoot);
}

function openModal(html) {
  modal = { html };
  if (appRoot) renderApp(appRoot);
}

function navLink(route, label, state) {
  const active = getRoute() === route ? "active" : "";
  const u = state.user;
  if (route === "config" && !canUser(u, "settings")) return "";
  if (route === "auditoria" && !canUser(u, "audit_read")) return "";
  return `<a class="${active}" href="#${route}">${label}</a>`;
}

function renderLogin(root) {
  root.innerHTML = `
    <div class="login-wrap">
      <div class="card login-card">
        <h2 style="margin-top:0">Gestão de Mesas</h2>
        <p class="empty" style="margin-top:-0.25rem">Frontend demo — dados no navegador (localStorage).</p>
        <div id="login-msg"></div>
        <form id="login-form" class="grid" style="gap:0.5rem;margin-top:0.75rem">
          <div class="field">
            <label>E-mail</label>
            <input name="email" type="email" autocomplete="username" required placeholder="gerente@demo.com" />
          </div>
          <div class="field">
            <label>Senha</label>
            <input name="senha" type="password" autocomplete="current-password" required placeholder="demo123" />
          </div>
          <button class="btn btn-primary" type="submit">Entrar</button>
        </form>
        <p class="empty" style="margin-top:1rem;font-size:0.82rem">
          Contas: <strong>gerente@demo.com</strong>, <strong>hostess@demo.com</strong>, <strong>garcom@demo.com</strong> — senha <strong>demo123</strong>.
        </p>
      </div>
    </div>
  `;
  const form = root.querySelector("#login-form");
  const msg = root.querySelector("#login-msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const senha = String(fd.get("senha") || "");
    const user = demoUsers().find((u) => u.email === email && u.senha === senha);
    if (!user) {
      msg.innerHTML = `<div class="alert error">Credenciais inválidas.</div>`;
      return;
    }
    const { senha: _, ...session } = user;
    dispatch({ type: "LOGIN", user: session });
    setHash("dashboard");
  });
}

function mesaPorId(state, id) {
  return state.mesas.find((m) => m.id === id);
}

function renderDashboard(state) {
  const ocupadas = state.mesas.filter((m) => m.status === "ocupada").length;
  const reservadas = state.mesas.filter((m) => m.status === "reservada").length;
  const fila = state.fila.filter((f) => f.status === "aguardando").length;
  const proximas = [...state.reservas]
    .filter((r) => ["pendente", "confirmada"].includes(r.status))
    .sort((a, b) => new Date(a.inicioISO) - new Date(b.inicioISO))
    .slice(0, 6);

  const rows = proximas
    .map((r) => {
      const m = r.mesaId ? mesaPorId(state, r.mesaId) : null;
      const late =
        ["confirmada", "pendente"].includes(r.status) &&
        toleranciaUltrapassada(r.inicioISO, r.toleranciaMin ?? state.settings.toleranciaPadraoMin);
      return `<tr>
        <td>${escapeHtml(r.nome)}</td>
        <td>${r.pessoas}</td>
        <td>${fmtDateTime(r.inicioISO)}</td>
        <td>${escapeHtml(r.status)}${late ? ' <span class="tag">tolerância</span>' : ""}</td>
        <td>${m ? escapeHtml(m.nome) : "—"}</td>
      </tr>`;
    })
    .join("");

  return `
    <div class="topbar">
      <div>
        <h1 style="margin:0;font-size:1.35rem">Painel operacional</h1>
        <div class="pill">${escapeHtml(state.settings.nomeRestaurante)}</div>
      </div>
      <div class="row">
        <span class="pill">Perfil: ${escapeHtml(state.user.role)}</span>
        <button class="btn btn-ghost" type="button" id="btn-logout">Sair</button>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><strong>${ocupadas}/${state.mesas.length}</strong><span>Mesas ocupadas</span></div>
      <div class="stat"><strong>${reservadas}</strong><span>Mesas marcadas reservadas</span></div>
      <div class="stat"><strong>${fila}</strong><span>Clientes na fila</span></div>
      <div class="stat"><strong>${state.settings.estimativaEsperaMin} min</strong><span>Estimativa fila (config.)</span></div>
    </div>
    <div class="grid cols-3" style="margin-top:1rem">
      <div class="card">
        <h2>Atalhos</h2>
        <div class="row">
          <button class="btn btn-primary" type="button" data-go="mapa">Mapa do salão</button>
          <button class="btn" type="button" data-go="reservas">Reservas</button>
          <button class="btn" type="button" data-go="fila">Fila</button>
        </div>
        <p class="empty" style="margin-top:0.75rem">Use o mapa para mudar status rapidamente em horário de pico.</p>
      </div>
      <div class="card" style="grid-column: span 2">
        <h2>Próximas reservas</h2>
        ${
          proximas.length === 0
            ? `<p class="empty">Nenhuma reserva pendente/confirmada.</p>`
            : `<table class="table">
            <thead><tr><th>Cliente</th><th>Pax</th><th>Horário</th><th>Status</th><th>Mesa</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>`
        }
      </div>
    </div>
  `;
}

function renderMapa(state) {
  const cards = state.mesas
    .map((m) => {
      const stClass = `status-${m.status}`;
      return `<div class="mesa ${stClass}" data-mesa="${m.id}">
        <div class="nome">${escapeHtml(m.nome)}</div>
        <div class="meta">${escapeHtml(m.setor)} · ${m.capacidade} pax</div>
        <span class="tag">${escapeHtml(m.status)}</span>
        ${
          canUser(state.user, "mesa_status")
            ? `<div class="row" style="margin-top:0.45rem">
            <button class="btn" type="button" data-cycle="${m.id}">Alterar status</button>
          </div>`
            : ""
        }
      </div>`;
    })
    .join("");

  return `
    <div class="topbar">
      <div>
        <h1 style="margin:0;font-size:1.35rem">Mapa do salão</h1>
        <p class="empty" style="margin:0.15rem 0 0">Cores por status: livre, ocupada, reservada, limpeza.</p>
      </div>
      <button class="btn btn-ghost" type="button" id="btn-logout">Sair</button>
    </div>
    <div class="card">
      <div class="mesa-grid">${cards}</div>
    </div>
  `;
}

const statusCycle = ["livre", "ocupada", "reservada", "limpeza"];

function cycleStatus(current) {
  const i = statusCycle.indexOf(current);
  return statusCycle[(i + 1) % statusCycle.length];
}

function renderReservas(state) {
  const write = canUser(state.user, "reservas_write");
  const slotDur = state.settings.slotDuracaoMin;
  const rows = state.reservas
    .slice()
    .sort((a, b) => new Date(b.inicioISO) - new Date(a.inicioISO))
    .map((r) => {
      const m = r.mesaId ? mesaPorId(state, r.mesaId) : null;
      const tol = r.toleranciaMin ?? state.settings.toleranciaPadraoMin;
      const late =
        ["confirmada", "pendente"].includes(r.status) && toleranciaUltrapassada(r.inicioISO, tol);
      const actions = write
        ? `<div class="row" style="margin-top:0.35rem">
          ${["pendente", "confirmada"].includes(r.status) ? `<button class="btn btn-primary" type="button" data-checkin="${r.id}">Check-in</button>` : ""}
          ${r.status === "checkin" ? `<button class="btn" type="button" data-encerrar="${r.id}">Encerrar</button>` : ""}
          ${["pendente", "confirmada", "checkin"].includes(r.status) ? `<button class="btn btn-danger" type="button" data-noshow="${r.id}">No-show</button>` : ""}
          ${["pendente", "confirmada", "checkin"].includes(r.status) ? `<button class="btn" type="button" data-cancel="${r.id}">Cancelar</button>` : ""}
        </div>`
        : "";
      return `<tr>
        <td>
          <strong>${escapeHtml(r.nome)}</strong><br/>
          <span class="empty">${escapeHtml(r.telefone)}</span>
          ${actions}
        </td>
        <td>${r.pessoas}</td>
        <td>${fmtDateTime(r.inicioISO)}</td>
        <td>${escapeHtml(r.status)}${late ? `<div class="tag">Atraso > ${tol} min</div>` : `<div class="empty" style="margin-top:0.25rem">Atraso: ${minutosAtraso(r.inicioISO)} min</div>`}</td>
        <td>${m ? escapeHtml(m.nome) : "—"}</td>
        <td>${escapeHtml(r.observacoes || "—")}</td>
      </tr>`;
    })
    .join("");

  const form = write
    ? `<div class="card" style="margin-bottom:1rem">
        <h2>Nova reserva</h2>
        <form id="form-reserva" class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:0.65rem">
          <div class="field" style="grid-column:span 2">
            <label>Nome</label>
            <input name="nome" required maxlength="80" />
          </div>
          <div class="field">
            <label>Telefone</label>
            <input name="telefone" required maxlength="20" />
          </div>
          <div class="field">
            <label>Pessoas</label>
            <input name="pessoas" type="number" min="1" max="20" required />
          </div>
          <div class="field" style="grid-column:span 2">
            <label>Data e hora de início</label>
            <input name="inicio" type="datetime-local" required />
          </div>
          <div class="field" style="grid-column:span 2">
            <label>Observações</label>
            <textarea name="observacoes" rows="2" maxlength="200"></textarea>
          </div>
          <div class="row" style="grid-column:span 2">
            <button class="btn btn-primary" type="submit">Salvar reserva</button>
          </div>
        </form>
        <div id="reserva-msg"></div>
      </div>`
    : `<div class="alert">Somente leitura — perfil garçom não cadastra reservas.</div>`;

  return `
    <div class="topbar">
      <div>
        <h1 style="margin:0;font-size:1.35rem">Reservas</h1>
        <p class="empty" style="margin:0.15rem 0 0">Validação de limite percentual por horário e conflito ao alocar mesa.</p>
      </div>
      <button class="btn btn-ghost" type="button" id="btn-logout">Sair</button>
    </div>
    ${form}
    <div class="card">
      <h2>Lista</h2>
      <table class="table">
        <thead><tr><th>Cliente</th><th>Pax</th><th>Início</th><th>Status</th><th>Mesa</th><th>Obs.</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6" class="empty">Sem reservas.</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderFila(state) {
  const write = canUser(state.user, "fila_write");
  const ordem = state.fila
    .filter((f) => f.status === "aguardando")
    .sort((a, b) => new Date(a.entradaISO) - new Date(b.entradaISO));

  const lista = ordem
    .map((f, idx) => {
      const actions = write
        ? `<div class="row" style="margin-top:0.35rem">
            <button class="btn btn-primary" type="button" data-chamar="${f.id}">Chamar</button>
            <button class="btn btn-danger" type="button" data-desist="${f.id}">Desistência</button>
          </div>`
        : "";
      return `<tr>
        <td><strong>#${idx + 1}</strong></td>
        <td><strong>${escapeHtml(f.nome)}</strong><br/><span class="empty">${escapeHtml(f.telefone)}</span>${actions}</td>
        <td>${f.pessoas}</td>
        <td>${fmtDateTime(f.entradaISO)}</td>
        <td>${escapeHtml(f.status)}</td>
      </tr>`;
    })
    .join("");

  const form = write
    ? `<div class="card" style="margin-bottom:1rem">
        <h2>Entrar na fila</h2>
        <form id="form-fila" class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:0.65rem">
          <div class="field"><label>Nome</label><input name="nome" required maxlength="80" /></div>
          <div class="field"><label>Telefone</label><input name="telefone" required maxlength="20" /></div>
          <div class="field" style="grid-column:span 2"><label>Pessoas</label><input name="pessoas" type="number" min="1" max="20" required /></div>
          <div class="row" style="grid-column:span 2"><button class="btn btn-primary" type="submit">Adicionar</button></div>
        </form>
      </div>`
    : "";

  return `
    <div class="topbar">
      <div>
        <h1 style="margin:0;font-size:1.35rem">Fila de espera</h1>
        <p class="empty" style="margin:0.15rem 0 0">Ordem por chegada. Estimativa exibida: <strong>${state.settings.estimativaEsperaMin} min</strong> (Fase 2: cálculo automático).</p>
      </div>
      <button class="btn btn-ghost" type="button" id="btn-logout">Sair</button>
    </div>
    ${form}
    <div class="card">
      <h2>Fila atual</h2>
      <table class="table">
        <thead><tr><th>Pos.</th><th>Cliente</th><th>Pax</th><th>Entrada</th><th>Status</th></tr></thead>
        <tbody>${lista || `<tr><td colspan="5" class="empty">Fila vazia.</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderConfig(state) {
  if (!canUser(state.user, "settings")) {
    return `<div class="alert error">Sem permissão.</div>`;
  }
  const s = state.settings;
  return `
    <div class="topbar">
      <div>
        <h1 style="margin:0;font-size:1.35rem">Configurações</h1>
        <p class="empty" style="margin:0.15rem 0 0">Parâmetros usados nas validações do frontend.</p>
      </div>
      <button class="btn btn-ghost" type="button" id="btn-logout">Sair</button>
    </div>
    <div class="card">
      <form id="form-settings" class="grid" style="max-width:520px">
        <div class="field">
          <label>Nome do restaurante</label>
          <input name="nomeRestaurante" value="${escapeHtml(s.nomeRestaurante)}" required />
        </div>
        <div class="field">
          <label>Máximo % de mesas reserváveis por horário</label>
          <input name="maxReservaPercent" type="number" min="5" max="100" step="1" value="${s.maxReservaPercent}" required />
        </div>
        <div class="field">
          <label>Tolerância padrão (minutos)</label>
          <input name="toleranciaPadraoMin" type="number" min="5" max="120" value="${s.toleranciaPadraoMin}" required />
        </div>
        <div class="field">
          <label>Duração padrão da reserva (minutos)</label>
          <input name="slotDuracaoMin" type="number" min="30" max="300" step="15" value="${s.slotDuracaoMin}" required />
        </div>
        <div class="field">
          <label>Estimativa de espera exibida na fila (min)</label>
          <input name="estimativaEsperaMin" type="number" min="5" max="180" value="${s.estimativaEsperaMin}" required />
        </div>
        <div class="row">
          <button class="btn btn-primary" type="submit">Salvar</button>
          <button class="btn btn-danger" type="button" id="btn-reset">Resetar dados demo</button>
        </div>
      </form>
    </div>
  `;
}

function renderAuditoria(state) {
  if (!canUser(state.user, "audit_read")) return `<div class="alert error">Sem permissão.</div>`;
  const rows = (state.audit || [])
    .slice(0, 40)
    .map(
      (a) => `<tr>
      <td>${fmtDateTime(a.t)}</td>
      <td>${escapeHtml(a.user || "—")}</td>
      <td>${escapeHtml(a.action || "")}</td>
      <td><code style="font-size:0.75rem;color:var(--muted)">${escapeHtml(JSON.stringify(a.detail || a))}</code></td>
    </tr>`
    )
    .join("");
  return `
    <div class="topbar">
      <div>
        <h1 style="margin:0;font-size:1.35rem">Auditoria</h1>
        <p class="empty" style="margin:0.15rem 0 0">Últimas ações registradas neste navegador.</p>
      </div>
      <button class="btn btn-ghost" type="button" id="btn-logout">Sair</button>
    </div>
    <div class="card">
      <table class="table">
        <thead><tr><th>Quando</th><th>Usuário</th><th>Ação</th><th>Detalhe</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="4" class="empty">Sem registros.</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function renderShell(state, inner) {
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          Gestão de Mesas
          <small>${escapeHtml(state.settings.nomeRestaurante)}</small>
        </div>
        <nav class="nav-links">
          ${navLink("dashboard", "Painel", state)}
          ${navLink("mapa", "Mapa", state)}
          ${navLink("reservas", "Reservas", state)}
          ${navLink("fila", "Fila", state)}
          ${navLink("config", "Configurações", state)}
          ${navLink("auditoria", "Auditoria", state)}
        </nav>
        <div style="margin-top:auto;font-size:0.78rem;color:var(--muted)">
          Requisitos consolidados em <code>src/config/requisitos.json</code><br/>
          Backlog Fase 2 em <code>src/config/backlog-fase2.json</code>
        </div>
      </aside>
      <main class="main">${inner}</main>
    </div>
    ${
      modal
        ? `<div class="modal-backdrop" id="modal-root">${modal.html}</div>`
        : ""
    }
  `;
}

function bindCommon(root, state) {
  root.querySelector("#btn-logout")?.addEventListener("click", () => {
    dispatch({ type: "LOGOUT" });
    setHash("login");
  });
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => setHash(btn.getAttribute("data-go")));
  });
}

function bindMapa(root) {
  root.querySelectorAll("[data-cycle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cycle");
      const st = getState().mesas.find((m) => m.id === id);
      if (!st) return;
      dispatch({
        type: "UPDATE_MESA",
        id,
        patch: { status: cycleStatus(st.status) },
        audit: { action: "UPDATE_MESA", detail: { id, novo: cycleStatus(st.status) } },
      });
    });
  });
}

function liberarMesaSePreciso(state, mesaId) {
  if (!mesaId) return;
  const m = mesaPorId(state, mesaId);
  if (!m) return;
  if (m.status === "ocupada" || m.status === "reservada") {
    dispatch({
      type: "UPDATE_MESA",
      id: mesaId,
      patch: { status: "livre" },
      audit: { action: "LIBERAR_MESA", detail: { mesaId } },
    });
  }
}

function bindReservas(root, state) {
  const form = root.querySelector("#form-reserva");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const nome = String(fd.get("nome") || "").trim();
      const telefone = String(fd.get("telefone") || "").trim();
      const pessoas = Number(fd.get("pessoas") || 0);
      const inicioLocal = String(fd.get("inicio") || "");
      const observacoes = String(fd.get("observacoes") || "").trim();
      const inicioISO = new Date(inicioLocal).toISOString();
      const msg = root.querySelector("#reserva-msg");
      const compat = mesasCompativeis(getState().mesas, pessoas);
      if (compat.length === 0) {
        msg.innerHTML = `<div class="alert error">Não há mesa com capacidade para ${pessoas} pessoa(s).</div>`;
        return;
      }
      const chk = podeCriarReserva({
        mesas: getState().mesas,
        reservas: getState().reservas,
        inicioISO,
        maxReservaPercent: getState().settings.maxReservaPercent,
        slotDuracaoMin: getState().settings.slotDuracaoMin,
      });
      if (!chk.ok) {
        msg.innerHTML = `<div class="alert error">${escapeHtml(chk.motivo)}</div>`;
        return;
      }
      const reserva = {
        id: uid("r"),
        nome,
        telefone,
        pessoas,
        inicioISO,
        duracaoMin: getState().settings.slotDuracaoMin,
        status: "confirmada",
        mesaId: null,
        toleranciaMin: getState().settings.toleranciaPadraoMin,
        observacoes,
      };
      dispatch({
        type: "ADD_RESERVA",
        reserva,
        audit: { action: "ADD_RESERVA", detail: { id: reserva.id } },
      });
      msg.innerHTML = `<div class="alert success">Reserva criada. Alocação de mesa ocorre no check-in.</div>`;
      form.reset();
    });
  }
  root.querySelectorAll("[data-cancel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cancel");
      const r = getState().reservas.find((x) => x.id === id);
      if (!r) return;
      liberarMesaSePreciso(getState(), r.mesaId);
      dispatch({
        type: "PATCH_RESERVA",
        id,
        patch: { status: "cancelada" },
        audit: { action: "CANCEL_RESERVA", detail: { id } },
      });
    });
  });
  root.querySelectorAll("[data-noshow]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-noshow");
      const r = getState().reservas.find((x) => x.id === id);
      if (!r) return;
      liberarMesaSePreciso(getState(), r.mesaId);
      dispatch({
        type: "PATCH_RESERVA",
        id,
        patch: { status: "no_show", mesaId: null },
        audit: { action: "NO_SHOW", detail: { id } },
      });
    });
  });
  root.querySelectorAll("[data-encerrar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-encerrar");
      const r = getState().reservas.find((x) => x.id === id);
      if (!r || !r.mesaId) return;
      dispatch({
        type: "PATCH_RESERVA",
        id,
        patch: { status: "concluida" },
        audit: { action: "ENCERRAR_RESERVA", detail: { id } },
      });
      dispatch({
        type: "UPDATE_MESA",
        id: r.mesaId,
        patch: { status: "limpeza" },
        audit: { action: "MESA_LIMPEZA", detail: { mesaId: r.mesaId } },
      });
    });
  });
  root.querySelectorAll("[data-checkin]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-checkin");
      const r = getState().reservas.find((x) => x.id === id);
      if (!r) return;
      const s = getState();
      const candidatas = mesasCompativeis(
        s.mesas.filter((m) => m.status === "livre" || m.id === r.mesaId),
        r.pessoas
      ).filter((m) =>
        podeAlocarMesa({
          reservas: s.reservas,
          mesaId: m.id,
          inicioISO: r.inicioISO,
          duracaoMin: r.duracaoMin,
          ignorarReservaId: r.id,
          slotDuracaoMin: s.settings.slotDuracaoMin,
        }).ok
      );
      if (candidatas.length === 0) {
        alert("Não há mesa livre compatível sem conflito de horário.");
        return;
      }
      const options = candidatas
        .map(
          (m) =>
            `<option value="${m.id}">${escapeHtml(m.nome)} — ${m.capacidade} pax (${escapeHtml(
              m.setor
            )})</option>`
        )
        .join("");
      openModal(
        `
        <div class="modal">
          <h3 style="margin-top:0">Check-in — ${escapeHtml(r.nome)}</h3>
          <p class="empty">Sugerimos a menor mesa possível; o operador confirma a alocação.</p>
          <form id="form-checkin" class="grid" style="gap:0.65rem;margin-top:0.5rem">
            <input type="hidden" name="reservaId" value="${escapeHtml(id)}" />
            <div class="field">
              <label>Mesa</label>
              <select name="mesaId" required>${options}</select>
            </div>
            <div class="row">
              <button class="btn btn-primary" type="submit">Confirmar</button>
              <button class="btn btn-ghost" type="button" id="modal-close">Cancelar</button>
            </div>
          </form>
        </div>
      `
      );
    });
  });
}

function bindCheckinModal(root) {
  const backdrop = root.querySelector("#modal-root");
  if (!backdrop) return;
  backdrop.querySelector("#modal-close")?.addEventListener("click", closeModal);
  backdrop.querySelector("#form-checkin")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const mesaId = String(fd.get("mesaId"));
    const rid = String(fd.get("reservaId"));
    const st = getState();
    const rv = st.reservas.find((x) => x.id === rid);
    if (!rv) return;
    const ok = podeAlocarMesa({
      reservas: st.reservas,
      mesaId,
      inicioISO: rv.inicioISO,
      duracaoMin: rv.duracaoMin,
      ignorarReservaId: rv.id,
      slotDuracaoMin: st.settings.slotDuracaoMin,
    });
    if (!ok.ok) {
      alert(ok.motivo);
      return;
    }
    dispatch({
      type: "PATCH_RESERVA",
      id: rid,
      patch: { status: "checkin", mesaId },
      audit: { action: "CHECKIN", detail: { id: rid, mesaId } },
    });
    dispatch({
      type: "UPDATE_MESA",
      id: mesaId,
      patch: { status: "ocupada" },
      audit: { action: "MESA_OCUPADA", detail: { mesaId } },
    });
    closeModal();
  });
}

function bindFila(root) {
  const form = root.querySelector("#form-fila");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const item = {
      id: uid("f"),
      nome: String(fd.get("nome") || "").trim(),
      telefone: String(fd.get("telefone") || "").trim(),
      pessoas: Number(fd.get("pessoas") || 0),
      entradaISO: new Date().toISOString(),
      status: "aguardando",
      prioridade: 0,
    };
    dispatch({
      type: "ADD_FILA",
      item,
      audit: { action: "ADD_FILA", detail: { id: item.id } },
    });
    form.reset();
  });
  root.querySelectorAll("[data-desist]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-desist");
      dispatch({
        type: "REMOVE_FILA",
        id,
        audit: { action: "DESISTENCIA_FILA", detail: { id } },
      });
    });
  });
  root.querySelectorAll("[data-chamar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-chamar");
      dispatch({
        type: "PATCH_FILA",
        id,
        patch: { status: "chamado", chamadoISO: new Date().toISOString() },
        audit: { action: "CHAMAR_FILA", detail: { id } },
      });
      alert("Cliente chamado (simulação). Fase 2: WhatsApp/SMS automático.");
    });
  });
}

function bindConfig(root) {
  root.querySelector("#form-settings")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    dispatch({
      type: "UPDATE_SETTINGS",
      patch: {
        nomeRestaurante: String(fd.get("nomeRestaurante") || "").trim(),
        maxReservaPercent: Number(fd.get("maxReservaPercent")),
        toleranciaPadraoMin: Number(fd.get("toleranciaPadraoMin")),
        slotDuracaoMin: Number(fd.get("slotDuracaoMin")),
        estimativaEsperaMin: Number(fd.get("estimativaEsperaMin")),
      },
      audit: { action: "UPDATE_SETTINGS", detail: Object.fromEntries(fd.entries()) },
    });
  });
  root.querySelector("#btn-reset")?.addEventListener("click", () => {
    if (confirm("Apagar dados locais e restaurar demo?")) {
      dispatch({ type: "RESET_DEMO" });
      setHash("dashboard");
    }
  });
}

function renderApp(root) {
  const state = getState();
  if (!state.user) {
    renderLogin(root);
    return;
  }
  const route = getRoute();
  let inner = "";
  if (route === "mapa") inner = renderMapa(state);
  else if (route === "reservas") inner = renderReservas(state);
  else if (route === "fila") inner = renderFila(state);
  else if (route === "config") inner = renderConfig(state);
  else if (route === "auditoria") inner = renderAuditoria(state);
  else inner = renderDashboard(state);

  root.innerHTML = renderShell(state, inner);
  bindCommon(root, state);
  if (route === "mapa") bindMapa(root);
  if (route === "reservas") bindReservas(root, state);
  if (route === "fila") bindFila(root);
  if (route === "config") bindConfig(root);

  if (modal) {
    root.querySelector("#modal-root")?.addEventListener("click", (e) => {
      if (e.target.id === "modal-root") closeModal();
    });
    bindCheckinModal(root);
  }
}

export function mountApp(root) {
  appRoot = root;
  const rerender = () => renderApp(root);
  window.addEventListener("hashchange", rerender);
  subscribe(rerender);
  rerender();
}

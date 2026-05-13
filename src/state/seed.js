const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const isoLocal = (d, h, min = 0) => {
  const x = new Date(d);
  x.setHours(h, min, 0, 0);
  return x.toISOString();
};

const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export function createSeedState() {
  const mesas = [
    { id: "m1", nome: "M1", setor: "Salão", capacidade: 2, status: "livre" },
    { id: "m2", nome: "M2", setor: "Salão", capacidade: 2, status: "livre" },
    { id: "m3", nome: "M3", setor: "Salão", capacidade: 4, status: "ocupada" },
    { id: "m4", nome: "M4", setor: "Salão", capacidade: 4, status: "livre" },
    { id: "m5", nome: "M5", setor: "Varanda", capacidade: 4, status: "reservada" },
    { id: "m6", nome: "M6", setor: "Varanda", capacidade: 6, status: "livre" },
    { id: "m7", nome: "M7", setor: "Varanda", capacidade: 6, status: "limpeza" },
    { id: "m8", nome: "M8", setor: "Salão", capacidade: 2, status: "livre" },
    { id: "m9", nome: "M9", setor: "Salão", capacidade: 2, status: "livre" },
    { id: "m10", nome: "M10", setor: "Privativo", capacidade: 8, status: "livre" },
    { id: "m11", nome: "M11", setor: "Salão", capacidade: 4, status: "livre" },
    { id: "m12", nome: "M12", setor: "Salão", capacidade: 4, status: "livre" },
  ];

  const inicio = isoLocal(hoje, 19, 0);

  const reservas = [
    {
      id: "r1",
      nome: "Ana Costa",
      telefone: "61999990001",
      pessoas: 2,
      inicioISO: inicio,
      duracaoMin: 120,
      status: "confirmada",
      mesaId: "m5",
      toleranciaMin: 15,
      observacoes: "Aniversário",
    },
    {
      id: "r2",
      nome: "Bruno Lima",
      telefone: "61988880002",
      pessoas: 4,
      inicioISO: inicio,
      duracaoMin: 120,
      status: "pendente",
      mesaId: null,
      toleranciaMin: 15,
      observacoes: "",
    },
  ];

  const fila = [
    {
      id: "f1",
      nome: "Carla Dias",
      telefone: "61977770003",
      pessoas: 3,
      entradaISO: new Date(now.getTime() - 25 * 60000).toISOString(),
      status: "aguardando",
      prioridade: 0,
    },
    {
      id: "f2",
      nome: "Diego Souza",
      telefone: "61966660004",
      pessoas: 2,
      entradaISO: new Date(now.getTime() - 10 * 60000).toISOString(),
      status: "aguardando",
      prioridade: 0,
    },
  ];

  return {
    user: null,
    mesas,
    reservas,
    fila,
    settings: {
      nomeRestaurante: "Restaurante Demo",
      maxReservaPercent: 35,
      toleranciaPadraoMin: 15,
      slotDuracaoMin: 120,
      estimativaEsperaMin: 35,
    },
    audit: [],
  };
}

export function demoUsers() {
  return [
    {
      email: "gerente@demo.com",
      senha: "demo123",
      nome: "Mariana",
      role: "gerente",
    },
    {
      email: "hostess@demo.com",
      senha: "demo123",
      nome: "Juliana",
      role: "hostess",
    },
    {
      email: "garcom@demo.com",
      senha: "demo123",
      nome: "Pedro",
      role: "garcom",
    },
  ];
}

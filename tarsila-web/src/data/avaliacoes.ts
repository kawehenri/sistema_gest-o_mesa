import type { Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "rv1",
    nome: "Helena Marques",
    iniciais: "HM",
    nota: 5,
    comentario:
      "Cozinha brasileira com alma. O pintado defumado é inesquecível e o serviço é cuidadoso sem ser formal demais. Uma experiência que vai além do prato.",
    data: "Há 3 dias",
    fonte: "Google",
  },
  {
    id: "rv2",
    nome: "Rafael Tognetti",
    iniciais: "RT",
    nota: 5,
    comentario:
      "Lugar lindo, vinhos brasileiros bem escolhidos e o atendimento da Camila fez toda a diferença. A costela bovina 12h é absurdamente boa. Voltarei sempre.",
    data: "Há 1 semana",
    fonte: "TripAdvisor",
  },
  {
    id: "rv3",
    nome: "Patrícia Yanaguita",
    iniciais: "PY",
    nota: 4,
    comentario:
      "Adoramos os pratos veganos. Sobremesa de cacau com jabuticaba estava divina. Música um pouco alta no sábado, mas nada que estragou a noite.",
    data: "Há 2 semanas",
    fonte: "Google",
  },
  {
    id: "rv4",
    nome: "André Castelani",
    iniciais: "AC",
    nota: 5,
    comentario:
      "Fui no aniversário da minha esposa e a equipe fez questão de tornar o momento especial. O ambiente, a luz, os pratos — tudo harmonioso. Top de SP.",
    data: "Há 3 semanas",
    fonte: "Google",
  },
  {
    id: "rv5",
    nome: "Fernanda Lopes",
    iniciais: "FL",
    nota: 5,
    comentario:
      "O ceviche de peixe do dia com maracujá foi uma revelação. Harmonização com vinhos nacionais surpreendeu muito. Sommelier super atencioso e didático.",
    data: "Há 1 mês",
    fonte: "TripAdvisor",
  },
  {
    id: "rv6",
    nome: "Gustavo Mendes",
    iniciais: "GM",
    nota: 5,
    comentario:
      "Ambiente sofisticado sem ser esnobe. Pão de fermentação com manteiga defumada já valeu a visita. Serviço impecável, sem pressa mas sem abandono.",
    data: "Há 1 mês",
    fonte: "Google",
  },
  {
    id: "rv7",
    nome: "Isabela Corrêa",
    iniciais: "IC",
    nota: 4,
    comentario:
      "Risoto de pequi maravilhoso, ingredientes de altíssima qualidade. Esperei um pouco pela sobremesa, mas a experiência geral foi incrível. Já indiquei para amigos.",
    data: "Há 5 semanas",
    fonte: "iFood",
  },
  {
    id: "rv8",
    nome: "Marcelo Brandão",
    iniciais: "MB",
    nota: 5,
    comentario:
      "A Tarsila Vila Madalena tem a melhor moqueca que já comi em São Paulo. Frutos do mar fresquíssimos, dendê de qualidade, pirão perfeito. Nota 10.",
    data: "Há 6 semanas",
    fonte: "Google",
  },
];

export const ratingGeral = {
  media: 4.9,
  total: 2418,
  distribuicao: [
    { estrelas: 5, percentual: 78 },
    { estrelas: 4, percentual: 16 },
    { estrelas: 3, percentual: 4 },
    { estrelas: 2, percentual: 1 },
    { estrelas: 1, percentual: 1 },
  ],
};

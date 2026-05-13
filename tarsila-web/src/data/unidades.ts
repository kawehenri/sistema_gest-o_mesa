import type { RestaurantUnit } from "@/types";

export const unidades: RestaurantUnit[] = [
  {
    id: "u1",
    numero: "01",
    nome: "Tarsila Vila Madalena",
    descricao:
      "A casa-mãe. Cozinha aberta, fogo a lenha e o salão mais animado do grupo. Ambiente aconchegante com tijolos aparentes e jardim interno.",
    endereco: "R. Aspicuelta, 412 — Vila Madalena, SP",
    telefone: "(11) 4002-8922",
    horario: "Ter–Dom · 12h às 23h",
    imagemUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    slug: "vila-madalena",
  },
  {
    id: "u2",
    numero: "02",
    nome: "Tarsila Pinheiros",
    descricao:
      "Conceito enxuto, balcão de chef e menu degustação em 6 tempos. Ideal para experiências gastronômicas íntimas e jantares especiais.",
    endereco: "R. dos Pinheiros, 980 — Pinheiros, SP",
    telefone: "(11) 4002-8923",
    horario: "Qua–Dom · 19h às 00h",
    imagemUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    slug: "pinheiros",
  },
  {
    id: "u3",
    numero: "03",
    nome: "Tarsila Jardins",
    descricao:
      "Espaço de eventos privados e a nossa confeitaria autoral. Aluguel de espaço para celebrações exclusivas com menu personalizado.",
    endereco: "Al. Lorena, 2.044 — Jardins, SP",
    telefone: "(11) 4002-8924",
    horario: "Seg–Sáb · 09h às 21h",
    imagemUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    slug: "jardins",
  },
];

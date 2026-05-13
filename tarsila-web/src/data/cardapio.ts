import type { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  // ENTRADAS
  {
    id: "e1",
    nome: "Bolinho de feijoada",
    descricao: "Recheado com costelinha defumada e farofa de couve.",
    preco: 38,
    categoria: "entradas",
    badge: "assinatura",
    destaque: true,
  },
  {
    id: "e2",
    nome: "Tartar de atum & tucupi",
    descricao: "Atum fresco, leite de coco verde, jambu e farofa de tapioca.",
    preco: 64,
    categoria: "entradas",
  },
  {
    id: "e3",
    nome: "Pão de fermentação natural",
    descricao: "Manteiga defumada na brasa e flor de sal.",
    preco: 22,
    categoria: "entradas",
    badge: "vegetariano",
  },
  {
    id: "e4",
    nome: "Ceviche de peixe do dia",
    descricao: "Leite de tigre com maracujá, coentro e crocante de arroz.",
    preco: 52,
    categoria: "entradas",
    badge: "recomendado",
  },

  // PRATOS PRINCIPAIS
  {
    id: "p1",
    nome: "Pintado defumado na brasa",
    descricao: "Com purê de banana-da-terra, farofa de castanhas e molho de tucupi.",
    preco: 98,
    categoria: "principais",
    badge: "assinatura",
    destaque: true,
  },
  {
    id: "p2",
    nome: "Costela bovina 12h",
    descricao: "Assada lentamente, com mandioca cremosa e vinagrete de ervas.",
    preco: 112,
    categoria: "principais",
    badge: "recomendado",
  },
  {
    id: "p3",
    nome: "Risoto de pequi e queijo canastra",
    descricao: "Arroz arbóreo, pequi fresco, lascas de canastra e azeite verde.",
    preco: 78,
    categoria: "principais",
    badge: "vegetariano",
  },
  {
    id: "p4",
    nome: "Frango caipira ao molho de jabuticaba",
    descricao: "Peito grelhado, redução de jabuticaba, polenta cremosa.",
    preco: 86,
    categoria: "principais",
  },
  {
    id: "p5",
    nome: "Moqueca de camarão do litoral",
    descricao: "Camarão VG, leite de coco, dendê artesanal, pirão e farofa.",
    preco: 104,
    categoria: "principais",
    badge: "novo",
  },

  // SOBREMESAS
  {
    id: "s1",
    nome: "Mousse de cacau com jabuticaba",
    descricao: "Cacau 70% de Ilhéus, coulis de jabuticaba e crocante de amêndoa.",
    preco: 36,
    categoria: "sobremesas",
    badge: "assinatura",
    destaque: true,
  },
  {
    id: "s2",
    nome: "Pudim de tapioca com coco",
    descricao: "Tapioca granulada, leite de coco e calda de rapadura.",
    preco: 28,
    categoria: "sobremesas",
    badge: "vegetariano",
  },
  {
    id: "s3",
    nome: "Sorvete de cupuaçu artesanal",
    descricao: "Duas bolas, farofa doce de castanha e mel de engenho.",
    preco: 32,
    categoria: "sobremesas",
    badge: "vegano",
  },

  // BEBIDAS
  {
    id: "b1",
    nome: "Caipirinha clássica",
    descricao: "Cachaça artesanal Minas Gerais, limão taiti, açúcar orgânico.",
    preco: 28,
    categoria: "bebidas",
  },
  {
    id: "b2",
    nome: "Suco de cupuaçu com hortelã",
    descricao: "Polpa natural, água mineral e hortelã fresca. Sem açúcar.",
    preco: 18,
    categoria: "bebidas",
    badge: "vegano",
  },
  {
    id: "b3",
    nome: "Kombucha de gengibre & limão",
    descricao: "Fermentada artesanalmente, levemente gaseificada.",
    preco: 22,
    categoria: "bebidas",
    badge: "vegano",
  },
  {
    id: "b4",
    nome: "Água de coco gelada",
    descricao: "Coco verde fresco, servido na hora.",
    preco: 14,
    categoria: "bebidas",
    badge: "vegano",
  },

  // HARMONIZAÇÃO
  {
    id: "h1",
    nome: "Harmonização com vinhos brasileiros",
    descricao: "Seleção de 4 taças de vinhos nacionais escolhidos pelo sommelier da casa.",
    preco: 95,
    categoria: "harmonizacao",
    badge: "recomendado",
    destaque: true,
  },
  {
    id: "h2",
    nome: "Harmonização com drinques autorais",
    descricao: "3 drinques exclusivos criados para acompanhar o menu degustação.",
    preco: 72,
    categoria: "harmonizacao",
  },
];

export const categorias = [
  { id: "entradas", label: "Entradas" },
  { id: "principais", label: "Principais" },
  { id: "sobremesas", label: "Sobremesas" },
  { id: "bebidas", label: "Bebidas" },
  { id: "harmonizacao", label: "Harmonização" },
] as const;

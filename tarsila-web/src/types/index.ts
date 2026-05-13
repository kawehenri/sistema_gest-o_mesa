export type MenuCategory =
  | "entradas"
  | "principais"
  | "sobremesas"
  | "bebidas"
  | "harmonizacao";

export type MenuBadge = "assinatura" | "vegetariano" | "vegano" | "recomendado" | "novo";

export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: MenuCategory;
  badge?: MenuBadge;
  destaque?: boolean;
}

export type ReviewSource = "Google" | "TripAdvisor" | "iFood";

export interface Review {
  id: string;
  nome: string;
  iniciais: string;
  nota: number;
  comentario: string;
  data: string;
  fonte: ReviewSource;
}

export interface RestaurantUnit {
  id: string;
  numero: string;
  nome: string;
  descricao: string;
  endereco: string;
  telefone: string;
  horario: string;
  imagemUrl: string;
  slug: string;
}

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "whatsapp"
  | "site";

export interface SocialChannel {
  id: string;
  plataforma: SocialPlatform;
  nome: string;
  handle: string;
  metrica: string;
  metricaLabel: string;
  url: string;
  cor: string;
  corTexto?: string;
}

export interface WaitlistEntry {
  id: string;
  nome: string;
  pessoas: number;
  minutosEspera: number;
  posicao: number;
}

export interface ReservationForm {
  nome: string;
  telefone: string;
  data: string;
  horario: string;
  pessoas: number;
  preferenciaMesa: string;
  observacoes: string;
}

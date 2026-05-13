import type { MenuBadge } from "@/types";

interface BadgeProps {
  variant: MenuBadge | "live";
  className?: string;
}

const variantConfig: Record<
  MenuBadge | "live",
  { label: string; classes: string }
> = {
  assinatura: {
    label: "Assinatura",
    classes: "bg-brand/10 text-brand border border-brand/20",
  },
  vegetariano: {
    label: "Vegetariano",
    classes: "bg-sage-bg text-sage border border-sage/20",
  },
  vegano: {
    label: "Vegano",
    classes: "bg-sage-bg text-sage-light border border-sage/20",
  },
  recomendado: {
    label: "Recomendado",
    classes: "bg-gold-bg text-gold border border-gold/20",
  },
  novo: {
    label: "Novo",
    classes: "bg-info/10 text-info border border-info/20",
  },
  live: {
    label: "Atualizando ao vivo",
    classes: "bg-success/10 text-success border border-success/20",
  },
};

export function Badge({ variant, className = "" }: BadgeProps) {
  const config = variantConfig[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${config.classes} ${className}`}
    >
      {variant === "live" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
        </span>
      )}
      {config.label}
    </span>
  );
}

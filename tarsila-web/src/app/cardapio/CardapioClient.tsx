"use client";

import { useState } from "react";
import { menuItems, categorias } from "@/data/cardapio";
import { Badge } from "@/components/ui/Badge";
import type { MenuCategory, MenuBadge } from "@/types";

function formatPrice(preco: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(preco);
}

export function CardapioClient() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("entradas");

  const filtered = menuItems.filter((item) => item.categoria === activeCategory);

  return (
    <>
      {/* Category Filter */}
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-10"
        role="tablist"
        aria-label="Categorias do cardápio"
      >
        {categorias.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${cat.id}`}
              onClick={() => setActiveCategory(cat.id as MenuCategory)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-graphite text-white shadow-sm"
                  : "bg-card text-graphite border border-sand hover:border-graphite/30 hover:bg-ivory"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div
        id={`panel-${activeCategory}`}
        role="tabpanel"
        aria-label={`Itens de ${activeCategory}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in"
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`card-base card-hover p-6 flex flex-col gap-3 relative ${
              item.destaque ? "ring-1 ring-brand/20" : ""
            }`}
          >
            {item.destaque && (
              <div className="absolute top-0 left-6 -translate-y-1/2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-brand text-white px-2 py-0.5 rounded-full">
                  Destaque
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <h2 className="heading-card flex-1">{item.nome}</h2>
              <span className="text-base font-bold text-graphite flex-shrink-0">
                {formatPrice(item.preco)}
              </span>
            </div>

            <p className="text-sm text-graphite/60 leading-relaxed">
              {item.descricao}
            </p>

            {item.badge && (
              <div>
                <Badge variant={item.badge as MenuBadge} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-graphite/40 text-sm">
            Nenhum item disponível nesta categoria no momento.
          </p>
        </div>
      )}

      {/* Footer note */}
      <p className="mt-10 text-xs text-graphite/40 text-center">
        Cardápio sujeito a alterações conforme disponibilidade dos ingredientes.
        Informe alergias e restrições alimentares ao garçom.
      </p>
    </>
  );
}

import type { Metadata } from "next";
import { CardapioClient } from "./CardapioClient";

export const metadata: Metadata = {
  title: "Cardápio",
  description:
    "Pratos elaborados a cada estação, com ingredientes frescos e produtores locais. Confira a carta completa da Tarsila Cozinha Brasil.",
};

export default function CardapioPage() {
  return (
    <section className="section-spacing" aria-labelledby="cardapio-heading">
      <div className="container-site">
        <div className="mb-10">
          <p className="section-label mb-3">Carta da estação</p>
          <h1 id="cardapio-heading" className="heading-display mb-4">
            Cardápio.
          </h1>
          <p className="text-body max-w-md">
            Pratos elaborados a cada estação, com ingredientes frescos e
            produtores locais. Preços por pessoa, exceto onde indicado.
          </p>
        </div>

        <CardapioClient />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { AvaliacoesClient } from "./AvaliacoesClient";

export const metadata: Metadata = {
  title: "Avaliações",
  description:
    "Mais de 2.400 avaliações reais de clientes em Google, TripAdvisor e iFood. A Tarsila tem nota 4.9. Confira o que dizem nossos clientes.",
};

export default function AvaliacoesPage() {
  return (
    <section className="section-spacing" aria-labelledby="avaliacoes-heading">
      <div className="container-site">
        <div className="mb-10">
          <p className="section-label mb-3">O que dizem os clientes</p>
          <h1 id="avaliacoes-heading" className="heading-display mb-4">
            Avaliações.
          </h1>
          <p className="text-body max-w-md">
            Mais de 2.400 avaliações reais de clientes em diferentes plataformas.
          </p>
        </div>

        <AvaliacoesClient />
      </div>
    </section>
  );
}

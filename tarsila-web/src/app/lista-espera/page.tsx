import type { Metadata } from "next";
import { ListaEsperaClient } from "./ListaEsperaClient";

export const metadata: Metadata = {
  title: "Lista de Espera",
  description:
    "Sem reserva? Sem problema. Entre na lista de espera virtual e acompanhe sua posição em tempo real. A Tarsila avisa quando sua mesa estiver pronta.",
};

export default function ListaEsperaPage() {
  return (
    <section className="section-spacing" aria-labelledby="lista-heading">
      <div className="container-site">
        <div className="mb-10">
          <p className="section-label mb-3">Sem reserva? Sem problema.</p>
          <h1 id="lista-heading" className="heading-display mb-4">
            Lista de espera em tempo real.
          </h1>
          <p className="text-body max-w-lg">
            Entre na fila virtual e nós te avisamos quando sua mesa estiver
            pronta.
          </p>
        </div>

        <ListaEsperaClient />
      </div>
    </section>
  );
}

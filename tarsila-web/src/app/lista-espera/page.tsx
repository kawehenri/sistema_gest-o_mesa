import type { Metadata } from "next";
import { ListaEsperaClient } from "./ListaEsperaClient";

export const metadata: Metadata = {
  title: "Lista de Espera",
  description:
    "Demonstração interativa de fila no navegador, sem servidor: posições e tempos são simulados apenas nesta sessão.",
};

export default function ListaEsperaPage() {
  return (
    <section className="section-spacing" aria-labelledby="lista-heading">
      <div className="container-site">
        <div className="mb-10">
          <p className="section-label mb-3">Sem reserva? Sem problema.</p>
          <h1 id="lista-heading" className="heading-display mb-4">
            Lista de espera (simulação).
          </h1>
          <p className="text-body max-w-lg">
            Demonstração no navegador: a fila existe só na memória desta aba —
            sem servidor, sem SMS real.
          </p>
        </div>

        <ListaEsperaClient />
      </div>
    </section>
  );
}

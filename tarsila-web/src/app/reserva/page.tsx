import type { Metadata } from "next";
import { ReservaClient } from "./ReservaClient";

export const metadata: Metadata = {
  title: "Reserva",
  description:
    "Reserve sua mesa na Tarsila Cozinha Brasil. Escolha data, horário, número de pessoas e preferências em poucos cliques.",
};

export default function ReservaPage() {
  return (
    <section className="section-spacing" aria-labelledby="reserva-heading">
      <div className="container-site">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="section-label mb-3">Garanta sua mesa</p>
            <h1 id="reserva-heading" className="heading-display mb-4">
              Reserva.
            </h1>
            <p className="text-body">
              Preencha os dados abaixo para reservar sua mesa. Enviaremos a
              confirmação por WhatsApp.
            </p>
          </div>

          <ReservaClient />
        </div>
      </div>
    </section>
  );
}

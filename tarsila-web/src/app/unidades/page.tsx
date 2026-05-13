import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { unidades } from "@/data/unidades";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Unidades",
  description:
    "O Grupo Tarsila tem 3 endereços em São Paulo: Vila Madalena, Pinheiros e Jardins. Conheça cada unidade e faça sua reserva.",
};

export default function UnidadesPage() {
  return (
    <section className="section-spacing" aria-labelledby="unidades-heading">
      <div className="container-site">
        <div className="mb-14">
          <p className="section-label mb-3">Grupo Tarsila</p>
          <h1 id="unidades-heading" className="heading-display mb-4">
            Onde encontrar a Tarsila.
          </h1>
          <p className="text-body max-w-md">
            Três endereços em São Paulo, cada um com uma proposta única — mas
            com a mesma dedicação à cozinha brasileira autoral.
          </p>
        </div>

        <div className="space-y-8">
          {unidades.map((unidade, idx) => {
            const reversed = idx % 2 !== 0;
            return (
              <article
                key={unidade.id}
                id={unidade.slug}
                className="card-base overflow-hidden"
                aria-labelledby={`unidade-${unidade.id}-nome`}
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 ${
                    reversed ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative h-64 lg:h-auto lg:min-h-[360px] ${
                      reversed ? "lg:col-start-2" : ""
                    }`}
                  >
                    <Image
                      src={unidade.imagemUrl}
                      alt={`Interior do restaurante ${unidade.nome}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Info */}
                  <div
                    className={`p-8 lg:p-12 flex flex-col justify-center ${
                      reversed ? "lg:col-start-1" : ""
                    }`}
                  >
                    <p className="section-label mb-2">
                      Unidade {unidade.numero}
                    </p>
                    <h2
                      id={`unidade-${unidade.id}-nome`}
                      className="font-serif text-3xl md:text-4xl font-bold text-graphite mb-4 leading-snug"
                    >
                      {unidade.nome}
                    </h2>
                    <p className="text-body mb-8">{unidade.descricao}</p>

                    <ul className="space-y-3 mb-8" aria-label="Informações de contato">
                      <li className="flex items-start gap-3 text-sm text-graphite/70">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{unidade.endereco}</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-graphite/70">
                        <svg className="w-4 h-4 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{unidade.telefone}</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-graphite/70">
                        <svg className="w-4 h-4 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{unidade.horario}</span>
                      </li>
                    </ul>

                    <div className="flex flex-wrap gap-3">
                      <Button href="/reserva" size="md">
                        Reservar nesta unidade →
                      </Button>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(unidade.endereco)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-sand text-graphite hover:bg-ivory hover:border-graphite/20 transition-all duration-200"
                      >
                        Como chegar
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 card-base p-10 text-center bg-graphite text-white border-0">
          <p className="section-label text-brand mb-3">Experiências privadas</p>
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Eventos exclusivos na Tarsila Jardins.
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Alugue o espaço para celebrações especiais com menu personalizado e
            serviço dedicado.
          </p>
          <Button href="/reserva" size="lg">
            Falar com a equipe →
          </Button>
        </div>
      </div>
    </section>
  );
}

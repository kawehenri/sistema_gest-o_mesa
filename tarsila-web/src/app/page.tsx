import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";

export const metadata: Metadata = {
  title: "Tarsila · Cozinha Brasil — Sabores do Brasil, servidos como uma carta de amor",
  description:
    "Cozinha autoral feita no fogo a lenha, com ingredientes de pequenos produtores e safras do mês. Reserve sua mesa em São Paulo.",
};

const diferenciais = [
  {
    icone: "🔥",
    titulo: "Fogo a lenha",
    descricao: "Toda a cozinha é feita em brasa, lenha e fogo vivo. O calor do Brasil no prato.",
  },
  {
    icone: "🌱",
    titulo: "Produtores locais",
    descricao: "Cada ingrediente vem de pequenos produtores parceiros, com rastreabilidade total.",
  },
  {
    icone: "📅",
    titulo: "Safras do mês",
    descricao: "O cardápio muda a cada estação. Sempre o melhor do que a natureza oferece agora.",
  },
  {
    icone: "🍷",
    titulo: "Vinhos brasileiros",
    descricao: "Carta curada com os melhores rótulos nacionais, escolhidos pelo nosso sommelier.",
  },
];

const destaques = [
  { label: "Cardápio", href: "/cardapio", desc: "Carta da estação" },
  { label: "Reserva", href: "/reserva", desc: "Garanta sua mesa" },
  { label: "Lista de espera", href: "/lista-espera", desc: "Sem reserva? Sem problema" },
  { label: "Avaliações", href: "/avaliacoes", desc: "4.9 · 2.418 avaliações" },
  { label: "Unidades", href: "/unidades", desc: "3 endereços em SP" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-[88vh] flex items-end pb-16 md:pb-24 overflow-hidden"
        aria-label="Apresentação do restaurante"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1600&q=85"
            alt="Mesa posta com taças de vinho e louça elegante do restaurante Tarsila"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>

        <div className="container-site w-full">
          <div className="max-w-2xl animate-slide-up">
            <p className="section-label text-white/70 mb-4">
              Desde 2014 · São Paulo
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 text-balance">
              Sabores do Brasil, servidos como uma carta de amor.
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-xl">
              Cozinha autoral feita no fogo a lenha, com ingredientes de
              pequenos produtores e safras do mês. Uma noite para lembrar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/reserva" size="lg">
                Reservar mesa →
              </Button>
              <Button href="/cardapio" size="lg" variant="ghost">
                Ver cardápio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION HUB */}
      <section className="bg-ivory-dark py-12 border-b border-sand">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {destaques.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card-base card-hover p-5 flex flex-col gap-1 group"
              >
                <span className="text-sm font-semibold text-graphite group-hover:text-brand transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-graphite/50">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="section-spacing bg-ivory" aria-labelledby="diferenciais-heading">
        <div className="container-site">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Nossa proposta</p>
            <h2
              id="diferenciais-heading"
              className="heading-section max-w-xl mx-auto text-balance"
            >
              Cozinha com identidade e respeito ao território.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((item) => (
              <div
                key={item.titulo}
                className="card-base card-hover p-7 flex flex-col gap-4"
              >
                <span className="text-3xl" role="img" aria-label={item.titulo}>
                  {item.icone}
                </span>
                <div>
                  <h3 className="heading-card mb-2">{item.titulo}</h3>
                  <p className="text-sm leading-relaxed text-graphite/60">
                    {item.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="section-spacing bg-card border-y border-sand" aria-labelledby="prova-heading">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-3">O que dizem os clientes</p>
              <h2
                id="prova-heading"
                className="heading-section mb-6 text-balance"
              >
                Mais de 2.400 avaliações reais.
              </h2>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-serif text-6xl font-bold text-graphite">4.9</span>
                <div>
                  <StarRating rating={4.9} size="lg" />
                  <p className="text-sm text-graphite/50 mt-1">
                    Baseado em 2.418 avaliações
                  </p>
                </div>
              </div>
              <Button href="/avaliacoes" variant="outline" size="lg">
                Ver todas as avaliações
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  nome: "Helena Marques",
                  texto:
                    "Cozinha brasileira com alma. O pintado defumado é inesquecível.",
                  nota: 5,
                  fonte: "Google",
                },
                {
                  nome: "Rafael Tognetti",
                  texto:
                    "Vinhos brasileiros bem escolhidos e atendimento que fez toda a diferença.",
                  nota: 5,
                  fonte: "TripAdvisor",
                },
              ].map((r) => (
                <div key={r.nome} className="card-base p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sand flex items-center justify-center text-graphite/70 text-xs font-bold flex-shrink-0">
                        {r.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-graphite">{r.nome}</p>
                        <p className="text-xs text-graphite/40">{r.fonte}</p>
                      </div>
                    </div>
                    <StarRating rating={r.nota} size="sm" />
                  </div>
                  <p className="text-sm text-graphite/65 leading-relaxed">"{r.texto}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA RESERVA */}
      <section
        className="relative py-24 overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80"
            alt="Ambiente interno do restaurante Tarsila"
            fill
            className="object-cover object-center opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-graphite/90" />
        </div>

        <div className="container-site text-center">
          <p className="section-label text-brand mb-4">Reserve agora</p>
          <h2
            id="cta-heading"
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 text-balance"
          >
            Uma mesa especial espera por você.
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-md mx-auto">
            Escolha a data, o horário e o número de pessoas. Em poucos cliques.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/reserva" size="lg">
              Reservar mesa →
            </Button>
            <Button href="/lista-espera" variant="ghost" size="lg">
              Entrar na lista de espera
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

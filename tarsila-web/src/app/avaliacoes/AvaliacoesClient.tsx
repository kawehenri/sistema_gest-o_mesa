"use client";

import { useState } from "react";
import { reviews, ratingGeral } from "@/data/avaliacoes";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import type { Review } from "@/types";

type Filter = "recentes" | "melhores";

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="card-base card-hover p-6 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-sand flex items-center justify-center text-graphite/70 text-sm font-bold flex-shrink-0 select-none"
            aria-hidden="true"
          >
            {review.iniciais}
          </div>
          <div>
            <p className="text-sm font-semibold text-graphite">{review.nome}</p>
            <p className="text-xs text-graphite/40">
              {review.data} · {review.fonte}
            </p>
          </div>
        </div>
        <StarRating rating={review.nota} size="sm" />
      </div>
      <p className="text-sm text-graphite/65 leading-relaxed">
        "{review.comentario}"
      </p>
    </article>
  );
}

export function AvaliacoesClient() {
  const [filter, setFilter] = useState<Filter>("recentes");
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({ nome: "", nota: 5, comentario: "" });
  const [submitted, setSubmitted] = useState(false);

  const sorted = [...reviews].sort((a, b) =>
    filter === "melhores" ? b.nota - a.nota : 0
  );

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setFormState({ nome: "", nota: 5, comentario: "" });
    }, 2000);
  }

  return (
    <>
      {/* Rating Overview */}
      <div className="card-base p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-serif text-7xl font-bold text-graphite leading-none">
                {ratingGeral.media}
              </p>
              <StarRating rating={ratingGeral.media} size="lg" />
              <p className="text-sm text-graphite/50 mt-2">
                Baseado em {ratingGeral.total.toLocaleString("pt-BR")} avaliações
              </p>
            </div>
          </div>

          <div className="space-y-2.5" aria-label="Distribuição de avaliações">
            {ratingGeral.distribuicao.map((item) => (
              <div key={item.estrelas} className="flex items-center gap-3">
                <span className="text-sm text-graphite/60 w-4 flex-shrink-0 text-right">
                  {item.estrelas}
                </span>
                <svg className="w-4 h-4 flex-shrink-0 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 h-2 bg-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-700"
                    style={{ width: `${item.percentual}%` }}
                    aria-label={`${item.percentual}% das avaliações`}
                  />
                </div>
                <span className="text-sm text-graphite/50 w-8 text-right flex-shrink-0">
                  {item.percentual}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div
          className="flex gap-2"
          role="group"
          aria-label="Filtrar avaliações"
        >
          {(["recentes", "melhores"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === f
                  ? "bg-graphite text-white"
                  : "bg-card text-graphite border border-sand hover:border-graphite/30"
              }`}
              aria-pressed={filter === f}
            >
              {f === "recentes" ? "Mais recentes" : "Melhores"}
            </button>
          ))}
        </div>

        <Button
          onClick={() => setShowModal(true)}
          variant="outline"
          size="sm"
        >
          + Escrever avaliação
        </Button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/40 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
        >
          <div className="bg-card rounded-3xl shadow-card-lg w-full max-w-md p-8 animate-slide-up">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-graphite mb-2">
                  Obrigado!
                </h3>
                <p className="text-sm text-graphite/55">Sua avaliação foi enviada.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 id="modal-heading" className="font-serif text-xl font-bold text-graphite">
                    Escrever avaliação
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-graphite/40 hover:text-graphite hover:bg-ivory transition-colors"
                    aria-label="Fechar modal"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <label htmlFor="review-nome" className="label-base">
                      Seu nome
                    </label>
                    <input
                      id="review-nome"
                      type="text"
                      className="input-base"
                      value={formState.nome}
                      onChange={(e) => setFormState((p) => ({ ...p, nome: e.target.value }))}
                      placeholder="Como deseja ser identificado?"
                      required
                      maxLength={60}
                    />
                  </div>

                  <div>
                    <label className="label-base">Sua nota</label>
                    <div className="flex gap-2 mt-1" role="group" aria-label="Selecionar nota">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setFormState((p) => ({ ...p, nota: n }))}
                          className="transition-transform hover:scale-110"
                          aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                          aria-pressed={formState.nota >= n}
                        >
                          <svg className={`w-8 h-8 transition-colors ${formState.nota >= n ? "text-gold" : "text-sand"}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="review-comentario" className="label-base">
                      Seu comentário
                    </label>
                    <textarea
                      id="review-comentario"
                      className="input-base resize-none"
                      rows={4}
                      value={formState.comentario}
                      onChange={(e) => setFormState((p) => ({ ...p, comentario: e.target.value }))}
                      placeholder="Como foi sua experiência na Tarsila?"
                      required
                      maxLength={500}
                    />
                  </div>

                  <Button type="submit" fullWidth size="lg">
                    Enviar avaliação
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { WaitlistEntry } from "@/types";

const initialFila: WaitlistEntry[] = [
  { id: "f1", nome: "Família Andrade", pessoas: 4, minutosEspera: 18, posicao: 1 },
  { id: "f2", nome: "Bruno & Carla", pessoas: 2, minutosEspera: 12, posicao: 2 },
  { id: "f3", nome: "Mesa Helena", pessoas: 6, minutosEspera: 6, posicao: 3 },
];

let idCounter = 4;

export function ListaEsperaClient() {
  const [fila, setFila] = useState<WaitlistEntry[]>(initialFila);
  const [nome, setNome] = useState("");
  const [pessoas, setPessoas] = useState("2");
  const [nomeError, setNomeError] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleEntrar = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!nome.trim()) {
        setNomeError("Informe um nome para a mesa.");
        return;
      }
      const novaPosicao = fila.length + 1;
      const novaEntrada: WaitlistEntry = {
        id: `f${idCounter++}`,
        nome: nome.trim(),
        pessoas: Number(pessoas),
        minutosEspera: 0,
        posicao: novaPosicao,
      };
      setFila((prev) => [...prev, novaEntrada]);
      setSubmitted(novaEntrada.id);
      setNome("");
      setPessoas("2");
      setNomeError("");
    },
    [fila.length, nome, pessoas]
  );

  const handleAtualizar = useCallback(() => {
    setUpdating(true);
    setTimeout(() => {
      setFila((prev) =>
        prev.map((entry) => ({
          ...entry,
          minutosEspera: entry.minutosEspera + 1,
        }))
      );
      setUpdating(false);
    }, 1200);
  }, []);

  const handleRemover = useCallback((id: string) => {
    setFila((prev) =>
      prev
        .filter((e) => e.id !== id)
        .map((e, idx) => ({ ...e, posicao: idx + 1 }))
    );
    if (submitted === id) setSubmitted(null);
  }, [submitted]);

  const myEntry = fila.find((e) => e.id === submitted);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Form Panel */}
      <div>
        <div className="card-base p-8 mb-6">
          <h2 className="font-serif text-xl font-bold text-graphite mb-6">
            Entrar na fila
          </h2>

          {submitted && myEntry ? (
            <div className="animate-slide-up">
              <div className="flex items-center gap-4 bg-success/8 rounded-2xl p-5 mb-5 border border-success/20">
                <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif font-bold text-success text-lg">
                    #{myEntry.posicao}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-graphite">{myEntry.nome}</p>
                  <p className="text-sm text-graphite/55">
                    {myEntry.pessoas} {myEntry.pessoas === 1 ? "pessoa" : "pessoas"} · você está na fila
                  </p>
                </div>
              </div>
              <p className="text-xs text-graphite/45 mb-5 text-center">
                Simulação local — nenhum aviso é enviado de verdade.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={handleAtualizar} variant="ghost" fullWidth disabled={updating}>
                  {updating ? "Atualizando…" : "Atualizar posição"}
                </Button>
                <Button onClick={() => handleRemover(submitted)} variant="outline" fullWidth>
                  Sair da fila
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEntrar} noValidate aria-label="Formulário lista de espera">
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome-fila" className="label-base">
                    Nome ou apelido <span className="text-brand">*</span>
                  </label>
                  <input
                    id="nome-fila"
                    type="text"
                    className={`input-base ${nomeError ? "border-error" : ""}`}
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (nomeError) setNomeError("");
                    }}
                    placeholder="Ex: Mesa Maria"
                    maxLength={60}
                    aria-describedby={nomeError ? "nome-fila-error" : undefined}
                    aria-invalid={!!nomeError}
                  />
                  {nomeError && (
                    <p id="nome-fila-error" className="mt-1.5 text-xs text-error" role="alert">
                      {nomeError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="pessoas-fila" className="label-base">
                    Quantas pessoas?
                  </label>
                  <select
                    id="pessoas-fila"
                    className="input-base"
                    value={pessoas}
                    onChange={(e) => setPessoas(e.target.value)}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "pessoa" : "pessoas"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" size="lg" fullWidth>
                  Entrar na lista
                </Button>
                <p className="text-xs text-graphite/40 text-center mt-3">
                  Avisaremos por SMS quando sua mesa estiver pronta. Tolerância de 10 minutos.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Estimate */}
        <div className="card-base p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-bg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-graphite">Tempo médio de espera</p>
            <p className="text-xs text-graphite/50">Aproximadamente 35 minutos · atualizado ao vivo</p>
          </div>
        </div>
      </div>

      {/* Queue Panel */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-graphite">Fila atual</h2>
          <Badge variant="live" />
        </div>

        {fila.length === 0 ? (
          <div className="card-base p-12 text-center">
            <p className="text-graphite/40 text-sm">A fila está vazia no momento.</p>
            <p className="text-graphite/30 text-xs mt-1">Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fila.map((entry) => {
              const isMe = entry.id === submitted;
              return (
                <div
                  key={entry.id}
                  className={`card-base p-5 flex items-center gap-4 transition-all duration-300 ${
                    isMe ? "ring-2 ring-brand/30 bg-brand/3" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      entry.posicao === 1
                        ? "bg-brand text-white"
                        : "bg-sand text-graphite/60"
                    }`}
                    aria-label={`Posição ${entry.posicao}`}
                  >
                    {entry.posicao}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-graphite text-sm truncate">
                      {entry.nome}
                      {isMe && (
                        <span className="ml-2 text-xs font-normal text-brand">
                          (você)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-graphite/50 mt-0.5">
                      {entry.pessoas} {entry.pessoas === 1 ? "pessoa" : "pessoas"}
                      {entry.minutosEspera > 0
                        ? ` · esperando há ${entry.minutosEspera} min`
                        : " · recém chegou"}
                    </p>
                  </div>
                  <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-graphite/30 hover:text-graphite/60 hover:bg-ivory transition-colors"
                    aria-label={`Notificações para ${entry.nome}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleAtualizar}
          disabled={updating}
          className="mt-4 w-full py-3 text-sm text-graphite/50 hover:text-graphite transition-colors disabled:opacity-50"
          aria-label="Atualizar posições na fila"
        >
          {updating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Atualizando…
            </span>
          ) : (
            "↻ Atualizar posições"
          )}
        </button>
      </div>
    </div>
  );
}

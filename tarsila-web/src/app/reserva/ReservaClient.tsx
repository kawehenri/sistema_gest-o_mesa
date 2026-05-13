"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ReservationForm } from "@/types";

type Step = "form" | "confirm" | "success";

const horarios = [
  "12:00", "12:30", "13:00", "13:30", "14:00",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

const preferencias = [
  { value: "", label: "Sem preferência" },
  { value: "salao", label: "Salão principal" },
  { value: "varanda", label: "Varanda" },
  { value: "privativo", label: "Espaço privativo" },
  { value: "balcao", label: "Balcão do chef" },
];

const initialForm: ReservationForm = {
  nome: "",
  telefone: "",
  data: "",
  horario: "",
  pessoas: 2,
  preferenciaMesa: "",
  observacoes: "",
};

type Errors = Partial<Record<keyof ReservationForm, string>>;

function validate(form: ReservationForm): Errors {
  const errs: Errors = {};
  if (!form.nome.trim()) errs.nome = "Informe seu nome.";
  if (!form.telefone.trim()) errs.telefone = "Informe um telefone para contato.";
  else if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(form.telefone.replace(/\s/g, "")))
    errs.telefone = "Formato: (11) 99999-9999";
  if (!form.data) errs.data = "Selecione uma data.";
  else {
    const chosen = new Date(form.data + "T00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (chosen < today) errs.data = "A data não pode ser no passado.";
  }
  if (!form.horario) errs.horario = "Selecione um horário.";
  if (!form.pessoas || form.pessoas < 1 || form.pessoas > 20)
    errs.pessoas = "Entre 1 e 20 pessoas.";
  return errs;
}

export function ReservaClient() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [errors, setErrors] = useState<Errors>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "pessoas" ? Number(value) : value,
    }));
    if (errors[name as keyof ReservationForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep("confirm");
  }

  function handleConfirm() {
    setStep("success");
  }

  function handleEdit() {
    setStep("form");
  }

  function handleNew() {
    setForm(initialForm);
    setErrors({});
    setStep("form");
  }

  const formatDate = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  if (step === "success") {
    return (
      <div className="card-base p-10 text-center animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-graphite mb-3">
          Reserva confirmada!
        </h2>
        <p className="text-graphite/60 mb-2">
          <strong className="text-graphite">{form.nome}</strong>, sua mesa está reservada para
        </p>
        <p className="font-semibold text-graphite mb-1">
          {formatDate(form.data)} às {form.horario} · {form.pessoas}{" "}
          {form.pessoas === 1 ? "pessoa" : "pessoas"}
        </p>
        <p className="text-sm text-graphite/50 mb-8">
          Na demonstração, nada é gravado nem enviado. Em um site real, a
          confirmação iria para <strong>{form.telefone}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleNew} variant="outline">
            Nova reserva
          </Button>
          <Button href="/cardapio">
            Ver cardápio
          </Button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="card-base p-8 animate-slide-up">
        <div className="mb-6 pb-6 border-b border-sand">
          <h2 className="font-serif text-xl font-bold text-graphite mb-1">
            Confirme sua reserva
          </h2>
          <p className="text-sm text-graphite/55">
            Verifique os dados antes de confirmar.
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { label: "Nome", value: form.nome },
            { label: "Telefone", value: form.telefone },
            { label: "Data", value: formatDate(form.data) },
            { label: "Horário", value: form.horario },
            { label: "Pessoas", value: `${form.pessoas} ${form.pessoas === 1 ? "pessoa" : "pessoas"}` },
            {
              label: "Preferência",
              value:
                preferencias.find((p) => p.value === form.preferenciaMesa)?.label ||
                "Sem preferência",
            },
            ...(form.observacoes
              ? [{ label: "Observações", value: form.observacoes }]
              : []),
          ].map((item) => (
            <div key={item.label} className="bg-ivory rounded-xl px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-graphite/40 mb-0.5">
                {item.label}
              </dt>
              <dd className="text-sm font-medium text-graphite">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleEdit} variant="ghost" fullWidth>
            Editar dados
          </Button>
          <Button onClick={handleConfirm} fullWidth>
            Confirmar reserva
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulário de reserva"
      className="card-base p-8 animate-fade-in"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nome */}
        <div className="sm:col-span-2">
          <label htmlFor="nome" className="label-base">
            Nome ou apelido da mesa <span className="text-brand">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            className={`input-base ${errors.nome ? "border-error focus:border-error focus:ring-error/30" : ""}`}
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Família Silva"
            maxLength={80}
            aria-describedby={errors.nome ? "nome-error" : undefined}
            aria-invalid={!!errors.nome}
            autoComplete="name"
          />
          {errors.nome && (
            <p id="nome-error" className="mt-1.5 text-xs text-error" role="alert">
              {errors.nome}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div className="sm:col-span-2">
          <label htmlFor="telefone" className="label-base">
            WhatsApp / telefone <span className="text-brand">*</span>
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            className={`input-base ${errors.telefone ? "border-error focus:border-error focus:ring-error/30" : ""}`}
            value={form.telefone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            maxLength={20}
            aria-describedby={errors.telefone ? "telefone-error" : undefined}
            aria-invalid={!!errors.telefone}
            autoComplete="tel"
          />
          {errors.telefone && (
            <p id="telefone-error" className="mt-1.5 text-xs text-error" role="alert">
              {errors.telefone}
            </p>
          )}
        </div>

        {/* Data */}
        <div>
          <label htmlFor="data" className="label-base">
            Data <span className="text-brand">*</span>
          </label>
          <input
            id="data"
            name="data"
            type="date"
            className={`input-base ${errors.data ? "border-error focus:border-error focus:ring-error/30" : ""}`}
            value={form.data}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            aria-describedby={errors.data ? "data-error" : undefined}
            aria-invalid={!!errors.data}
          />
          {errors.data && (
            <p id="data-error" className="mt-1.5 text-xs text-error" role="alert">
              {errors.data}
            </p>
          )}
        </div>

        {/* Horário */}
        <div>
          <label htmlFor="horario" className="label-base">
            Horário <span className="text-brand">*</span>
          </label>
          <select
            id="horario"
            name="horario"
            className={`input-base ${errors.horario ? "border-error focus:border-error focus:ring-error/30" : ""}`}
            value={form.horario}
            onChange={handleChange}
            aria-describedby={errors.horario ? "horario-error" : undefined}
            aria-invalid={!!errors.horario}
          >
            <option value="">Selecione…</option>
            {horarios.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {errors.horario && (
            <p id="horario-error" className="mt-1.5 text-xs text-error" role="alert">
              {errors.horario}
            </p>
          )}
        </div>

        {/* Pessoas */}
        <div>
          <label htmlFor="pessoas" className="label-base">
            Quantas pessoas? <span className="text-brand">*</span>
          </label>
          <select
            id="pessoas"
            name="pessoas"
            className={`input-base ${errors.pessoas ? "border-error focus:border-error focus:ring-error/30" : ""}`}
            value={form.pessoas}
            onChange={handleChange}
            aria-describedby={errors.pessoas ? "pessoas-error" : undefined}
            aria-invalid={!!errors.pessoas}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "pessoa" : "pessoas"}
              </option>
            ))}
          </select>
          {errors.pessoas && (
            <p id="pessoas-error" className="mt-1.5 text-xs text-error" role="alert">
              {errors.pessoas}
            </p>
          )}
        </div>

        {/* Preferência */}
        <div>
          <label htmlFor="preferenciaMesa" className="label-base">
            Preferência de mesa
          </label>
          <select
            id="preferenciaMesa"
            name="preferenciaMesa"
            className="input-base"
            value={form.preferenciaMesa}
            onChange={handleChange}
          >
            {preferencias.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Observações */}
        <div className="sm:col-span-2">
          <label htmlFor="observacoes" className="label-base">
            Observações
          </label>
          <textarea
            id="observacoes"
            name="observacoes"
            className="input-base resize-none"
            value={form.observacoes}
            onChange={handleChange}
            rows={3}
            placeholder="Aniversário, restrições alimentares, cadeirante…"
            maxLength={300}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Button type="submit" size="lg" fullWidth>
          Continuar para confirmação →
        </Button>
        <p className="text-xs text-graphite/40 text-center">
          Apenas simulação no seu dispositivo — sem API ou armazenamento.
        </p>
      </div>
    </form>
  );
}

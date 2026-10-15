"use client";
/* eslint-disable @next/next/no-img-element -- a logo é otimizada e armazenada como data URL */

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ImagePlus, LoaderCircle, Palette, RotateCcw, Save, Trash2 } from "lucide-react";
import { api } from "@/app/lib/api";

type Branding = {
  nome: string;
  nomeExibicao: string;
  slogan: string;
  logoUrl: string;
  corPrimaria: string;
  corSecundaria: string;
  corDestaque: string;
};

const DEFAULT_COLORS = {
  corPrimaria: "#ea580c",
  corSecundaria: "#0f172a",
  corDestaque: "#f97316",
};

const PRESETS = [
  { nome: "Laranja da casa", primaria: "#ea580c", secundaria: "#0f172a", destaque: "#f97316" },
  { nome: "Verde cozinha", primaria: "#15803d", secundaria: "#14261b", destaque: "#f59e0b" },
  { nome: "Azul contemporâneo", primaria: "#2563eb", secundaria: "#172554", destaque: "#f59e0b" },
  { nome: "Vinho clássico", primaria: "#9f1239", secundaria: "#27131a", destaque: "#d97706" },
];

function readableTextColor(hex: string): "#ffffff" | "#0f172a" {
  const safe = /^#[0-9a-f]{6}$/i.test(hex) ? hex : DEFAULT_COLORS.corPrimaria;
  const channels = [1, 3, 5].map((offset) => Number.parseInt(safe.slice(offset, offset + 2), 16) / 255);
  const luminance = channels
    .map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  return 1.05 / (luminance + 0.05) >= 4.5 ? "#ffffff" : "#0f172a";
}

function processLogo(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return Promise.reject(new Error("Escolha uma imagem PNG, JPEG ou WebP."));
  }
  if (file.size > 2_000_000) return Promise.reject(new Error("A imagem original deve ter no máximo 2 MB."));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("O arquivo de imagem é inválido."));
      image.onload = () => {
        const scale = Math.min(1, 520 / image.width, 240 / image.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("O navegador não conseguiu preparar a logo."));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const encoded = canvas.toDataURL("image/webp", 0.82);
        if (encoded.length > 68_000) return reject(new Error("A logo continua muito pesada. Use uma imagem mais simples ou menor."));
        resolve(encoded);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function BrandingEditor({
  establishment,
  onClose,
  onSaved,
}: {
  establishment: { id: string; nome: string };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void api<{ estabelecimento: Branding }>(`/estabelecimentos/${establishment.id}/branding`)
      .then((response) => { if (active) setForm(response.estabelecimento); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Falha ao carregar a identidade visual"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [establishment.id]);

  function update<K extends keyof Branding>(field: K, value: Branding[K]) {
    setForm((current) => current ? { ...current, [field]: value } : current);
  }

  async function selectLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setLogoLoading(true);
    setError("");
    try {
      update("logoUrl", await processLogo(file));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível preparar a logo");
    } finally {
      setLogoLoading(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const response = await api<{ estabelecimento: Branding }>(`/estabelecimentos/${establishment.id}/branding`, {
        method: "PATCH",
        body: JSON.stringify({
          nomeExibicao: form.nomeExibicao,
          slogan: form.slogan,
          logoUrl: form.logoUrl,
          corPrimaria: form.corPrimaria,
          corSecundaria: form.corSecundaria,
          corDestaque: form.corDestaque,
        }),
      });
      setForm(response.estabelecimento);
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar a personalização");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="inline-form min-h-40 place-items-center" role="status"><LoaderCircle className="animate-spin text-violet-700" /><span className="sr-only">Carregando personalização</span></div>;
  }

  if (!form) {
    return <div className="inline-form"><p className="m-0 text-sm font-semibold text-red-700">{error || "Não foi possível abrir a personalização."}</p><button type="button" onClick={onClose} className="secondary-button justify-self-start">Fechar</button></div>;
  }

  return (
    <form onSubmit={save} className="inline-form branding-editor">
      <div className="inline-form-heading">
        <div>
          <h4>Personalizar {establishment.nome}</h4>
          <p>Somente o Painel CEO pode alterar a identidade exibida no sistema deste estabelecimento.</p>
        </div>
        <button type="button" onClick={onClose} className="text-button">Fechar</button>
      </div>

      {error && <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field">
              <span>Nome exibido</span>
              <input value={form.nomeExibicao} onChange={(event) => update("nomeExibicao", event.target.value)} maxLength={80} required />
            </label>
            <label className="field">
              <span>Mensagem de entrada</span>
              <input value={form.slogan} onChange={(event) => update("slogan", event.target.value)} maxLength={140} placeholder="Ex.: Atendimento rápido, gestão completa." />
            </label>
          </div>

          <section className="rounded-xl bg-violet-50/70 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid h-24 w-full shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-3 shadow-[0_6px_18px_rgba(45,27,102,0.09)] sm:w-40">
                {form.logoUrl ? <img src={form.logoUrl} alt="Prévia da logo" className="h-full w-full object-contain" /> : <span className="text-3xl font-black text-violet-700">{form.nomeExibicao.charAt(0).toUpperCase() || "R"}</span>}
              </div>
              <div>
                <p className="m-0 text-sm font-extrabold text-slate-900">Logo principal</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">PNG, JPEG ou WebP, até 2 MB. A imagem é otimizada antes do envio.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-3.5 text-sm font-bold text-white hover:bg-slate-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-violet-700">
                    <ImagePlus size={16} />{logoLoading ? "Preparando..." : form.logoUrl ? "Trocar logo" : "Escolher logo"}
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void selectLogo(event)} disabled={logoLoading} className="sr-only" />
                  </label>
                  {form.logoUrl && <button type="button" onClick={() => update("logoUrl", "")} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50"><Trash2 size={16} />Remover</button>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2"><Palette size={18} className="text-violet-700" /><h5 className="m-0 text-sm font-extrabold text-slate-900">Cores da identidade</h5></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {([['corPrimaria', 'Principal'], ['corSecundaria', 'Institucional'], ['corDestaque', 'Destaque']] as const).map(([field, label]) => (
                <label key={field} className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700">
                  {label}
                  <span className="mt-2 flex items-center gap-2">
                    <input type="color" value={form[field]} onChange={(event) => update(field, event.target.value)} className="h-10 w-11 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" aria-label={`Cor ${label.toLowerCase()}`} />
                    <input value={form[field]} onChange={(event) => update(field, event.target.value)} pattern="#[0-9a-fA-F]{6}" maxLength={7} className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-bold uppercase" aria-label={`Cor ${label.toLowerCase()} hexadecimal`} />
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((preset) => <button key={preset.nome} type="button" onClick={() => setForm((current) => current ? { ...current, corPrimaria: preset.primaria, corSecundaria: preset.secundaria, corDestaque: preset.destaque } : current)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-violet-300 hover:bg-violet-50"><span className="flex">{[preset.primaria, preset.secundaria, preset.destaque].map((color) => <i key={color} className="-ml-1 h-5 w-5 first:ml-0 rounded-full border-2 border-white" style={{ backgroundColor: color }} />)}</span>{preset.nome}</button>)}
            </div>
          </section>
        </div>

        <aside className="overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(36,19,93,0.12)]">
          <div className="flex min-h-52 flex-col justify-between p-5" style={{ backgroundColor: form.corPrimaria, color: readableTextColor(form.corPrimaria) }}>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-white/15 p-2">{form.logoUrl ? <img src={form.logoUrl} alt="" className="h-full w-full object-contain" /> : <strong className="text-xl">{form.nomeExibicao.charAt(0).toUpperCase() || "R"}</strong>}</div>
              <strong>{form.nomeExibicao || establishment.nome}</strong>
            </div>
            <p className="m-0 text-2xl font-extrabold leading-tight tracking-[-0.03em]">{form.slogan || "Sua mensagem aparece aqui."}</p>
          </div>
          <div className="p-5" style={{ color: form.corSecundaria }}>
            <p className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500">Prévia do sistema</p>
            <div className="mt-4 flex items-center justify-between gap-3"><div><strong className="block">Mesa 08</strong><small className="text-slate-500">Em atendimento</small></div><span className="rounded-lg px-3 py-2 text-xs font-bold" style={{ backgroundColor: form.corPrimaria, color: readableTextColor(form.corPrimaria) }}>Abrir mesa</span></div>
            <div className="mt-4 h-1.5 rounded-full" style={{ backgroundColor: form.corDestaque }} />
          </div>
        </aside>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={() => setForm({ ...form, nomeExibicao: form.nome, slogan: "Operação, atendimento e gestão em um só lugar.", logoUrl: "", ...DEFAULT_COLORS })} disabled={saving} className="secondary-button inline-flex items-center justify-center gap-2"><RotateCcw size={16} />Restaurar padrão</button>
        <button disabled={saving || logoLoading} className="primary-button"><Save size={17} />{saving ? "Salvando..." : "Salvar personalização"}</button>
      </div>
    </form>
  );
}

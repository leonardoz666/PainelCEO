"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clipboard,
  ExternalLink,
  Database,
  KeyRound,
  LoaderCircle,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Store,
  TriangleAlert,
  Users,
} from "lucide-react";
import { api, ApiError } from "@/app/lib/api";

type Status = "TESTE" | "ATIVO" | "INADIMPLENTE" | "SUSPENSO" | "CANCELADO";
type Summary = {
  total: number;
  ativos: number;
  testes: number;
  pendentes: number;
  suspensos: number;
};
type Establishment = {
  id: string;
  nome: string;
  slug: string;
  email: string | null;
  telefone: string | null;
  status: Status;
  bancoConfigurado: boolean;
  criadoEm: string;
  assinatura: {
    valorMensal: number;
    proximoVencimento: string | null;
    status: string;
  } | null;
  plano: { nome: string } | null;
};

const STATUS_LABEL: Record<Status, string> = {
  TESTE: "Em teste",
  ATIVO: "Ativo",
  INADIMPLENTE: "Inadimplente",
  SUSPENSO: "Suspenso",
  CANCELADO: "Cancelado",
};
const STATUS_STYLE: Record<Status, string> = {
  TESTE: "bg-blue-50 text-blue-700",
  ATIVO: "bg-emerald-50 text-emerald-700",
  INADIMPLENTE: "bg-amber-50 text-amber-800",
  SUSPENSO: "bg-red-50 text-red-700",
  CANCELADO: "bg-slate-200 text-slate-700",
};

function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Store;
  tone: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-b border-slate-200 py-4 last:border-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}
      >
        <Icon size={19} />
      </span>
      <div>
        <p className="text-2xl font-bold tabular-nums text-slate-950">
          {value}
        </p>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [items, setItems] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ownerFor, setOwnerFor] = useState<Establishment | null>(null);
  const [ownerMode, setOwnerMode] = useState<"create" | "reset">("create");
  const [copied, setCopied] = useState("");
  const [provisioning, setProvisioning] = useState("");

  const operationalBase = useMemo(
    () =>
      (
        process.env.NEXT_PUBLIC_OPERATIONAL_URL ||
        "https://frontendrei.vercel.app"
      ).replace(/\/$/, ""),
    [],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await api("/auth/me");
      const [nextSummary, response] = await Promise.all([
        api<Summary>("/resumo"),
        api<{ data: Establishment[] }>("/estabelecimentos"),
      ]);
      setSummary(nextSummary);
      setItems(response.data);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401)
        return router.replace("/login");
      setError(
        reason instanceof Error ? reason.message : "Falha ao carregar o painel",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
  }

  async function createEstablishment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api("/estabelecimentos", {
        method: "POST",
        body: JSON.stringify({
          nome: form.get("nome"),
          slug: form.get("slug"),
          documento: form.get("documento") || null,
          email: form.get("email") || null,
          telefone: form.get("telefone") || null,
          databaseUrl: form.get("databaseUrl"),
          valorMensal: Number(form.get("valorMensal") || 0),
          proximoVencimento: form.get("proximoVencimento") || null,
        }),
      });
      event.currentTarget.reset();
      setShowCreate(false);
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Falha ao cadastrar estabelecimento",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(item: Establishment, status: Status) {
    const previous = item.status;
    setItems((current) =>
      current.map((value) =>
        value.id === item.id ? { ...value, status } : value,
      ),
    );
    try {
      await api(`/estabelecimentos/${item.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (reason) {
      setItems((current) =>
        current.map((value) =>
          value.id === item.id ? { ...value, status: previous } : value,
        ),
      );
      setError(
        reason instanceof Error ? reason.message : "Falha ao alterar acesso",
      );
    }
  }

  async function createOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerFor) return;
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api(`/estabelecimentos/${ownerFor.id}/dono`, {
        method: "POST",
        body: JSON.stringify({
          nome: form.get("nome"),
          login: form.get("login"),
          email: form.get("email") || null,
          senha: form.get("senha"),
        }),
      });
      setOwnerFor(null);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Falha ao criar acesso do Dono",
      );
    } finally {
      setSaving(false);
    }
  }

  async function resetOwnerPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ownerFor) return;
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api(`/estabelecimentos/${ownerFor.id}/dono/redefinir-senha`, {
        method: "POST",
        body: JSON.stringify({
          login: form.get("login"),
          senha: form.get("senha"),
        }),
      });
      setOwnerFor(null);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Falha ao redefinir a senha do Dono",
      );
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(item: Establishment) {
    const link = `${operationalBase}/e/${item.slug}`;
    await navigator.clipboard.writeText(link);
    setCopied(item.id);
    window.setTimeout(() => setCopied(""), 1800);
  }

  async function provisionDatabase(item: Establishment) {
    setProvisioning(item.id);
    setError("");
    try {
      await api(`/estabelecimentos/${item.id}/provisionar`, { method: "POST" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao preparar o banco");
    } finally {
      setProvisioning("");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-slate-200 bg-[#e8eef5] px-5 py-4 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
        <div className="flex items-center justify-between lg:block">
          <div className="flex items-center gap-3 px-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
              <ShieldCheck size={21} />
            </span>
            <div>
              <p className="font-bold text-slate-950">Rei Plataforma</p>
              <p className="text-xs text-slate-500">Painel CEO</p>
            </div>
          </div>
          <button
            onClick={() => void logout()}
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-950 lg:mt-10 lg:w-full"
          >
            <LogOut size={17} /> <span className="hidden lg:inline">Sair</span>
          </button>
        </div>
        <nav className="mt-6 hidden lg:block">
          <span className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-slate-950 shadow-sm">
            <Building2 size={18} className="text-orange-600" /> Estabelecimentos
          </span>
        </nav>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                Estabelecimentos
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                Controle clientes, disponibilidade e acessos sem misturar os
                dados operacionais.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => void load()}
                disabled={loading}
                aria-label="Atualizar"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
              <button
                onClick={() => setShowCreate((value) => !value)}
                className="flex h-10 items-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-orange-700"
              >
                <Plus size={17} /> Novo estabelecimento
              </button>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="ml-auto font-bold"
              >
                Fechar
              </button>
            </div>
          )}

          <section className="mt-6 grid rounded-xl border border-slate-200 bg-white px-5 shadow-sm sm:grid-cols-5">
            <Metric
              label="Total"
              value={summary?.total ?? 0}
              icon={Store}
              tone="bg-slate-100 text-slate-700"
            />
            <Metric
              label="Ativos"
              value={summary?.ativos ?? 0}
              icon={Check}
              tone="bg-emerald-50 text-emerald-700"
            />
            <Metric
              label="Em teste"
              value={summary?.testes ?? 0}
              icon={Users}
              tone="bg-blue-50 text-blue-700"
            />
            <Metric
              label="Pendentes"
              value={summary?.pendentes ?? 0}
              icon={CircleDollarSign}
              tone="bg-amber-50 text-amber-700"
            />
            <Metric
              label="Suspensos"
              value={summary?.suspensos ?? 0}
              icon={TriangleAlert}
              tone="bg-red-50 text-red-700"
            />
          </section>

          {showCreate && (
            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-950">
                  Cadastrar estabelecimento
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  O banco informado será testado e a conexão ficará
                  criptografada.
                </p>
              </div>
              <form
                onSubmit={createEstablishment}
                className="grid gap-4 md:grid-cols-2"
              >
                <Field name="nome" label="Nome" required />
                <Field
                  name="slug"
                  label="Link"
                  placeholder="rei-da-carne-de-sol"
                  required
                />
                <Field name="documento" label="CNPJ ou documento" />
                <Field name="email" label="E-mail comercial" type="email" />
                <Field name="telefone" label="Telefone" />
                <Field
                  name="valorMensal"
                  label="Mensalidade"
                  type="number"
                  placeholder="0,00"
                />
                <Field
                  name="proximoVencimento"
                  label="Próximo vencimento"
                  type="date"
                />
                <Field
                  name="databaseUrl"
                  label="Conexão PostgreSQL"
                  type="password"
                  required
                />
                <div className="flex justify-end gap-3 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="h-10 rounded-lg px-4 text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={saving}
                    className="flex h-10 items-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
                  >
                    {saving && (
                      <LoaderCircle size={16} className="animate-spin" />
                    )}{" "}
                    Cadastrar
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-bold text-slate-950">
                Clientes da plataforma
              </h2>
            </div>
            {loading ? (
              <div
                className="space-y-3 p-5"
                aria-label="Carregando estabelecimentos"
              >
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-lg bg-slate-100"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Building2 className="mx-auto text-slate-300" size={38} />
                <h3 className="mt-4 font-bold text-slate-900">
                  Nenhum estabelecimento cadastrado
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Cadastre o primeiro cliente para gerar o link de acesso.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {items.map((item) => (
                  <article key={item.id} className="p-5">
                    <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_minmax(140px,.7fr)_minmax(150px,.7fr)_auto] lg:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-bold text-slate-950">
                            {item.nome}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[item.status]}`}
                          >
                            {STATUS_LABEL[item.status]}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-500">
                          {item.slug} {item.email ? `• ${item.email}` : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Mensalidade
                        </p>
                        <p className="mt-1 font-bold tabular-nums text-slate-900">
                          {Number(
                            item.assinatura?.valorMensal ?? 0,
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                      <label className="relative block">
                        <span className="sr-only">Situação de {item.nome}</span>
                        <select
                          value={item.status}
                          onChange={(event) =>
                            void changeStatus(
                              item,
                              event.target.value as Status,
                            )
                          }
                          className="h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm font-semibold text-slate-800"
                        >
                          <option value="TESTE">Em teste</option>
                          <option value="ATIVO">Ativo</option>
                          <option value="INADIMPLENTE">Inadimplente</option>
                          <option value="SUSPENSO">Suspenso</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-3 top-3 text-slate-500"
                        />
                      </label>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <button
                          onClick={() => void provisionDatabase(item)}
                          disabled={provisioning === item.id}
                          title="Aplicar atualizações do sistema no banco deste estabelecimento"
                          className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {provisioning === item.id ? <LoaderCircle size={16} className="animate-spin" /> : <Database size={16} />}
                          Preparar banco
                        </button>
                        <button
                          onClick={() => void copyLink(item)}
                          className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                          {copied === item.id ? (
                            <Check size={16} />
                          ) : (
                            <Clipboard size={16} />
                          )}{" "}
                          {copied === item.id ? "Copiado" : "Copiar link"}
                        </button>
                        <a
                          href={`${operationalBase}/e/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Abrir ${item.nome}`}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => {
                            setOwnerFor((current) =>
                              current?.id === item.id ? null : item,
                            );
                            setOwnerMode("create");
                          }}
                          className="flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-bold text-white hover:bg-slate-800"
                        >
                          <KeyRound size={16} /> Acesso
                        </button>
                      </div>
                    </div>
                    {ownerFor?.id === item.id && (
                      <div className="mt-5 border-t border-slate-200 pt-5">
                        <div className="mb-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setOwnerMode("create")}
                            className={`h-9 rounded-lg px-3 text-sm font-bold ${ownerMode === "create" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-700"}`}
                          >
                            Criar Dono
                          </button>
                          <button
                            type="button"
                            onClick={() => setOwnerMode("reset")}
                            className={`h-9 rounded-lg px-3 text-sm font-bold ${ownerMode === "reset" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-700"}`}
                          >
                            Redefinir senha
                          </button>
                        </div>
                        {ownerMode === "create" ? (
                          <form onSubmit={createOwner} className="grid gap-4 md:grid-cols-4">
                            <Field name="nome" label="Nome do Dono" required />
                            <Field name="login" label="Login" required />
                            <Field name="email" label="E-mail" type="email" />
                            <Field name="senha" label="Senha inicial" type="password" required />
                            <OwnerActions saving={saving} onCancel={() => setOwnerFor(null)} label="Criar acesso do Dono" />
                          </form>
                        ) : (
                          <form onSubmit={resetOwnerPassword} className="grid gap-4 md:grid-cols-2">
                            <Field name="login" label="Login do Dono" required />
                            <Field name="senha" label="Nova senha" type="password" required />
                            <OwnerActions saving={saving} onCancel={() => setOwnerFor(null)} label="Redefinir senha" />
                          </form>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-900">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-orange-500"
      />
    </label>
  );
}

function OwnerActions({
  saving,
  onCancel,
  label,
}: {
  saving: boolean;
  onCancel: () => void;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-3 md:col-span-full">
      <button
        type="button"
        onClick={onCancel}
        className="h-10 rounded-lg px-4 text-sm font-bold text-slate-600 hover:bg-slate-100"
      >
        Cancelar
      </button>
      <button
        disabled={saving}
        className="h-10 rounded-lg bg-orange-600 px-4 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
      >
        {label}
      </button>
    </div>
  );
}

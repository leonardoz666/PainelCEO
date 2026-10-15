"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Database,
  KeyRound,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import { api } from "@/app/lib/api";

type AuditEntry = {
  id: number;
  acao: string;
  detalhe: string | null;
  criadoEm: string;
  usuarioCeo: { id: number; nome: string; email: string };
  estabelecimento: { id: string; nome: string; slug: string } | null;
};

type AuditResponse = {
  data: AuditEntry[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

const ACTIONS = [
  ["", "Todas as ações"],
  ["ESTABELECIMENTO_CRIADO", "Estabelecimento criado"],
  ["ESTABELECIMENTO_ATUALIZADO", "Estabelecimento atualizado"],
  ["BANCO_PROVISIONADO", "Banco atualizado"],
  ["STATUS_ALTERADO", "Status alterado"],
  ["ASSINATURA_ATUALIZADA", "Mensalidade atualizada"],
  ["TOKEN_IMPRESSAO_GERADO", "Token de impressão gerado"],
  ["DONO_CRIADO", "Acesso do dono criado"],
  ["DONO_RECONCILIADO", "Acesso do dono vinculado"],
  ["SENHA_DONO_REDEFINIDA", "Senha do dono redefinida"],
] as const;

const ACTION_LABEL = Object.fromEntries(ACTIONS.slice(1)) as Record<string, string>;

function safeDetail(value: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function detailText(entry: AuditEntry): string {
  const detail = safeDetail(entry.detalhe);
  if (entry.acao === "STATUS_ALTERADO")
    return `De ${String(detail.anterior ?? "—")} para ${String(detail.atual ?? "—")}`;
  if (entry.acao === "ASSINATURA_ATUALIZADA") {
    const value = Number(detail.valorMensal ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return `Novo valor: ${value}`;
  }
  if (typeof detail.login === "string") return `Login: ${detail.login}`;
  return entry.estabelecimento ? `Ação concluída em ${entry.estabelecimento.nome}` : "Ação concluída na plataforma";
}

function AuditIcon({ action }: { action: string }) {
  if (action === "BANCO_PROVISIONADO") return <Database size={19} />;
  if (action === "ASSINATURA_ATUALIZADA") return <CircleDollarSign size={19} />;
  if (action === "TOKEN_IMPRESSAO_GERADO") return <ShieldCheck size={19} />;
  if (action.includes("DONO") || action.includes("SENHA")) return <UserRoundCog size={19} />;
  if (action === "ESTABELECIMENTO_CRIADO") return <Building2 size={19} />;
  if (action === "STATUS_ALTERADO") return <Activity size={19} />;
  return <KeyRound size={19} />;
}

export function AuditHistory() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "25" });
      if (search) params.set("search", search);
      if (action) params.set("acao", action);
      const response = await api<AuditResponse>(`/auditorias?${params.toString()}`);
      setEntries(response.data);
      setPagination(response.pagination);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar o histórico");
    } finally {
      setLoading(false);
    }
  }, [action, page, search]);

  useEffect(() => { void load(); }, [load]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <section className="audit-panel" aria-labelledby="audit-title">
      <div className="audit-toolbar">
        <div>
          <h2 id="audit-title">Atividades registradas</h2>
          <p>{pagination.total} {pagination.total === 1 ? "registro encontrado" : "registros encontrados"}</p>
        </div>
        <div className="audit-controls">
          <form className="audit-search" onSubmit={submitSearch}>
            <Search size={18} />
            <label className="sr-only" htmlFor="audit-search">Buscar no histórico</label>
            <input id="audit-search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Cliente, usuário ou ação..." />
            <button type="submit">Buscar</button>
          </form>
          <label className="audit-filter">
            <span className="sr-only">Filtrar por ação</span>
            <select value={action} onChange={(event) => { setAction(event.target.value); setPage(1); }}>
              {ACTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <button type="button" onClick={() => void load()} disabled={loading} className="refresh-button" aria-label="Atualizar histórico">
            <RefreshCw size={19} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error ? <div className="audit-error" role="alert">{error}<button type="button" onClick={() => void load()}>Tentar novamente</button></div> : null}

      {loading ? (
        <div className="audit-loading" aria-label="Carregando histórico">
          {[1, 2, 3, 4].map((item) => <div key={item} className="audit-skeleton" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <Activity size={42} />
          <h3>Nenhuma atividade encontrada</h3>
          <p>Altere os filtros ou realize uma ação no painel.</p>
        </div>
      ) : (
        <ol className="audit-list">
          {entries.map((entry) => (
            <li key={entry.id} className="audit-item">
              <span className="audit-icon"><AuditIcon action={entry.acao} /></span>
              <div className="audit-copy">
                <div className="audit-title-line">
                  <strong>{ACTION_LABEL[entry.acao] ?? entry.acao.replaceAll("_", " ")}</strong>
                  <time dateTime={entry.criadoEm}>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.criadoEm))}</time>
                </div>
                <p>{detailText(entry)}</p>
                <div className="audit-meta">
                  <span>{entry.estabelecimento?.nome ?? "Plataforma"}</span>
                  <span>{entry.usuarioCeo.nome}</span>
                  <span>{entry.usuarioCeo.email}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="audit-pagination" aria-label="Paginação do histórico">
        <span>Página {pagination.page} de {pagination.pages}</span>
        <div>
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || loading} aria-label="Página anterior"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => setPage((value) => Math.min(pagination.pages, value + 1))} disabled={page >= pagination.pages || loading} aria-label="Próxima página"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

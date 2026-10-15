'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff, LoaderCircle, LockKeyhole } from 'lucide-react'
import { api, ApiError } from '@/app/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void api('/auth/me').then(() => router.replace('/')).catch(() => undefined)
  }, [router])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) })
      router.replace('/')
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : 'Não foi possível entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-bold"><Building2 className="text-orange-500" /> Rei Plataforma</div>
        <div className="max-w-2xl">
          <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-[-0.04em]">Todos os estabelecimentos sob o seu controle.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Administre acessos, assinaturas e disponibilidade sem entrar na operação dos restaurantes.</p>
        </div>
        <p className="text-sm text-slate-400">Ambiente exclusivo da administração da plataforma.</p>
      </section>

      <section className="flex items-center justify-center bg-white px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm" aria-busy={loading}>
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm lg:hidden"><LockKeyhole /></div>
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950">Entrar no painel CEO</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use seu acesso global. Usuários de restaurantes não entram por aqui.</p>

          <label className="mt-8 block text-sm font-bold text-slate-900" htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-3 text-slate-950 shadow-sm transition focus:border-orange-500" />

          <label className="mt-5 block text-sm font-bold text-slate-900" htmlFor="senha">Senha</label>
          <div className="relative mt-2">
            <input id="senha" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={senha} onChange={event => setSenha(event.target.value)} className="h-12 w-full rounded-lg border border-slate-300 px-3 pr-12 text-slate-950 shadow-sm transition focus:border-orange-500" />
            <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 hover:text-slate-900">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>

          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">{error}</p>}
          <button disabled={loading} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 font-bold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading && <LoaderCircle size={18} className="animate-spin" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

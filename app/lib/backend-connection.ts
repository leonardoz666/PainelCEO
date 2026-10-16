export class BackendConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BackendConfigurationError'
  }
}

export function configuredBackendUrl(rawValue = process.env.BACKEND_URL): URL {
  const value = rawValue?.trim()
  if (!value) throw new BackendConfigurationError('BACKEND_URL não está configurada')
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new BackendConfigurationError('BACKEND_URL não contém uma URL válida')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BackendConfigurationError('BACKEND_URL deve usar HTTP ou HTTPS')
  }
  return url
}

export function configuredBackendTimeout(rawValue = process.env.BACKEND_PROXY_TIMEOUT_MS): number {
  const parsed = Number(rawValue)
  return Number.isFinite(parsed) && parsed >= 1000 ? parsed : 10_000
}

export async function fetchBackend(input: string | URL, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const forwardAbort = () => controller.abort()
  if (init.signal?.aborted) forwardAbort()
  else init.signal?.addEventListener('abort', forwardAbort, { once: true })
  const timeout = setTimeout(() => controller.abort(), configuredBackendTimeout())

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
    init.signal?.removeEventListener('abort', forwardAbort)
  }
}

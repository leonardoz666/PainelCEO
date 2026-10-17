import { NextRequest, NextResponse } from 'next/server'
import { BackendConfigurationError, backendTimeoutFor, configuredBackendUrl, fetchBackend } from '../../lib/backend-connection'

const HOP_BY_HOP = ['connection', 'content-length', 'host', 'transfer-encoding']

async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params
    const base = configuredBackendUrl()
    const incoming = new URL(request.url)
    const target = new URL(path.join('/'), base)
    target.search = incoming.search
    const headers = new Headers(request.headers)
    HOP_BY_HOP.forEach(name => headers.delete(name))
    const method = request.method.toUpperCase()
    const response = await fetchBackend(target, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(),
      redirect: 'manual',
      cache: 'no-store',
    }, backendTimeoutFor(path.join('/'), method))
    const responseHeaders = new Headers(response.headers)
    responseHeaders.delete('content-length')
    responseHeaders.delete('content-encoding')
    responseHeaders.delete('transfer-encoding')
    return new Response(response.body, { status: response.status, headers: responseHeaders })
  } catch (error) {
    if (error instanceof BackendConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    const timedOut = error instanceof Error && error.name === 'AbortError'
    return NextResponse.json(
      { error: timedOut ? 'O backend não respondeu a tempo' : 'Backend indisponível' },
      { status: timedOut ? 504 : 502 },
    )
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
export const maxDuration = 120

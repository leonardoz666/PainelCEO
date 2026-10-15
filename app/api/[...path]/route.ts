import { NextRequest, NextResponse } from 'next/server'

const FALLBACK_BACKEND = 'https://backendrei.onrender.com'
const HOP_BY_HOP = ['connection', 'content-length', 'host', 'transfer-encoding']

async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params
    const base = (process.env.BACKEND_URL || FALLBACK_BACKEND).replace(/\/$/, '')
    const incoming = new URL(request.url)
    const target = new URL(path.join('/'), `${base}/`)
    target.search = incoming.search
    const headers = new Headers(request.headers)
    HOP_BY_HOP.forEach(name => headers.delete(name))
    const method = request.method.toUpperCase()
    const response = await fetch(target, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(),
      redirect: 'manual',
      cache: 'no-store',
    })
    const responseHeaders = new Headers(response.headers)
    responseHeaders.delete('content-length')
    responseHeaders.delete('content-encoding')
    responseHeaders.delete('transfer-encoding')
    return new Response(response.body, { status: response.status, headers: responseHeaders })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Backend indisponível' }, { status: 502 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler

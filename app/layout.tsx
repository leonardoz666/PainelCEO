import type { Metadata } from 'next'
import '@fontsource-variable/manrope'
import './globals.css'

export const metadata: Metadata = {
  title: 'Painel CEO | ControlaÊ',
  description: 'Controle global dos estabelecimentos na plataforma ControlaÊ',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

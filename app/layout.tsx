import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/contexts/toast-context'
import { DynamicFaviconProvider } from '@/components/dynamic-favicon-provider'

export const metadata: Metadata = {
  title: 'Team Balancer ⚽',
  description: 'Balanceador de equipos inteligente con sistema de votación',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <DynamicFaviconProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </DynamicFaviconProvider>
      </body>
    </html>
  )
}

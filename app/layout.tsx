import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/contexts/toast-context'
import { DynamicFaviconProvider } from '@/components/dynamic-favicon-provider'
import { LoadingProvider } from '@/contexts/loading-context'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
  title: 'Team Balancer ⚽',
  description: 'Balanceador de equipos inteligente con sistema de votación',
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
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
            <LoadingProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </LoadingProvider>
          </ToastProvider>
        </DynamicFaviconProvider>
      </body>
    </html>
  )
}

'use client'

import { useDynamicFavicon } from '@/hooks/use-dynamic-favicon'

export function DynamicFaviconProvider({ children }: { children: React.ReactNode }) {
  useDynamicFavicon()
  return <>{children}</>
}

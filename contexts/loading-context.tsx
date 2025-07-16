"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { SoccerLoading } from '@/components/ui/loading'

interface LoadingContextType {
  isLoading: boolean
  message: string
  showLoading: (message?: string) => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: React.ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('Cargando...')
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  const showLoading = useCallback((loadingMessage = 'Cargando datos...') => {
    setMessage(loadingMessage)
    setIsLoading(true)
    setLoadingStartTime(Date.now())
  }, [])

  const hideLoading = useCallback(() => {
    if (loadingStartTime) {
      const elapsed = Date.now() - loadingStartTime
      const minLoadingTime = 500 // 0.5 segundos mínimo
      
      if (elapsed < minLoadingTime) {
        // Si no ha pasado suficiente tiempo, esperar el tiempo restante
        setTimeout(() => {
          setIsLoading(false)
          setLoadingStartTime(null)
        }, minLoadingTime - elapsed)
      } else {
        // Si ya pasó suficiente tiempo, ocultar inmediatamente
        setIsLoading(false)
        setLoadingStartTime(null)
      }
    } else {
      setIsLoading(false)
    }
  }, [loadingStartTime])

  const value = {
    isLoading,
    message,
    showLoading,
    hideLoading
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <SoccerLoading show={isLoading} message={message} />
    </LoadingContext.Provider>
  )
}

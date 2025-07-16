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

  const showLoading = useCallback((loadingMessage = 'Cargando datos...') => {
    setMessage(loadingMessage)
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

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

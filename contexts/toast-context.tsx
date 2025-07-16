"use client"

import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { ToastContainer } from '@/components/ui/toast-container'
import { Toast, ToastType } from '@/components/ui/toast-notification'

interface ToastContextType {
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  toasts: Toast[]
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = `${Date.now()}-${Math.random()}`
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration: duration || 5000
    }
    
    setToasts(prev => [...prev, toast])
    
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    return addToast('success', title, message)
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    return addToast('error', title, message)
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    return addToast('warning', title, message)
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    return addToast('info', title, message)
  }, [addToast])

  const contextValue = {
    success,
    error,
    warning,
    info,
    toasts,
    removeToast
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

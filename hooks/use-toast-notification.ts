"use client"

import { useState, useCallback } from 'react'
import { Toast, ToastType } from '@/components/ui/toast-notification'

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Date.now().toString()
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration
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

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll
  }
}

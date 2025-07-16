"use client"

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import ToastNotification from '@/components/ui/toast-notification'
import { useToastContext } from '@/contexts/toast-context'

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>,
    document.body
  )
}

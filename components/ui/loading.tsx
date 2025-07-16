import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  message?: string
}

export function LoadingSpinner({ size = 'md', color = '#3b82f6', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}
          style={{ 
            borderTopColor: color,
            borderRightColor: color 
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg">⚽</span>
        </div>
      </div>
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  children: React.ReactNode
}

export function LoadingOverlay({ isLoading, message = 'Cargando...', children }: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  )
}

interface LoadingCardProps {
  message?: string
  className?: string
}

export function LoadingCard({ message = 'Cargando información...', className = '' }: LoadingCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-8 ${className}`}>
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
}

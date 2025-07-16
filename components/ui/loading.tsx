import React from 'react'
import './loading.css'

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
            <div className="absolute inset-0 loading-overlay flex items-center justify-center z-10">
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

interface SoccerLoadingProps {
    message?: string
    show?: boolean
}

export function SoccerLoading({ message = 'Cargando datos...', show = true }: SoccerLoadingProps) {
    if (!show) return null

    // Lista de todos los GIFs disponibles en la carpeta public
    const availableGifs = [
        '/tiro-penal-alexis-sanchez.gif',
        '/gif1.gif',
        '/gif2.gif',
        '/gif3.gif',
        '/gif4.gif',
        '/gif5.gif',
        '/gif6.gif',
        '/gif7.gif',
        '/gif8.gif',
        '/giphy1.gif'
    ]

    // Seleccionar un GIF aleatorio cada vez que se renderiza
    const [randomGif] = React.useState(() => {
        const randomIndex = Math.floor(Math.random() * availableGifs.length)
        return availableGifs[randomIndex]
    })

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl loading-modal">
                <div className="flex flex-col items-center justify-center space-y-6">
                    {/* GIF aleatorio */}
                    <div className="relative w-64 h-48 bg-green-500 rounded-lg overflow-hidden shadow-lg">
                        <img
                            src={randomGif}
                            alt="Animación de fútbol"
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                // Fallback si el GIF no carga
                                const target = e.target as HTMLImageElement
                                target.src = '/tiro-penal-alexis-sanchez.gif'
                            }}
                        />
                        {/* Overlay sutil para mejor legibilidad */}
                        <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg"></div>
                    </div>

                    {/* Texto de carga */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            ⚽ Team Balancer
                        </h3>
                        <p className="text-gray-600 animate-pulse mb-4">
                            {message}
                        </p>
                        <div className="loading-dots">
                            <div className="loading-dot bg-blue-500"></div>
                            <div className="loading-dot bg-green-500"></div>
                            <div className="loading-dot bg-yellow-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Hook para manejar estados de carga globales
export function useGlobalLoading() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [message, setMessage] = React.useState('Cargando...')

    const showLoading = React.useCallback((loadingMessage = 'Cargando...') => {
        setMessage(loadingMessage)
        setIsLoading(true)
    }, [])

    const hideLoading = React.useCallback(() => {
        setIsLoading(false)
    }, [])

    return { isLoading, message, showLoading, hideLoading }
}

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, X, Trash2, Shield } from 'lucide-react'

interface ResetConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  groupName: string
  playerCount: number
  isResetting: boolean
}

export default function ResetConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  playerCount,
  isResetting
}: ResetConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg relative">
          <button
            onClick={onClose}
            disabled={isResetting}
            className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">¡Acción Irreversible!</CardTitle>
              <CardDescription className="text-red-100">
                Confirma el reseteo de puntajes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">¿Estás seguro?</h3>
              </div>
              <p className="text-sm text-red-700">
                Esta acción eliminará <strong>todos los votos y puntajes</strong> del grupo <strong>"{groupName}"</strong>.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Información del grupo</h3>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>Grupo:</strong> {groupName}</li>
                <li>• <strong>Jugadores afectados:</strong> {playerCount}</li>
                <li>• <strong>Datos que se perderán:</strong> Todos los votos y promedios</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Consecuencias:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✗ Se eliminarán todos los votos existentes</li>
                <li>✗ Los puntajes promedio volverán a 0</li>
                <li>✗ Los jugadores deberán votar nuevamente</li>
                <li>✗ Esta acción no se puede deshacer</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isResetting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isResetting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isResetting ? 'Reseteando...' : 'Confirmar Reset'}
            </Button>
          </div>

          {isResetting && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-700">Reseteando puntajes...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

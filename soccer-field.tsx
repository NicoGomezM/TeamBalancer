"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Player {
  id: string
  name: string
  totalPoints: number
  hasVoted: boolean
}

interface Team {
  name: string
  players: Player[]
  totalPoints: number
}

interface SoccerFieldProps {
  teams: Team[]
}

export default function SoccerField({ teams }: SoccerFieldProps) {
  if (teams.length !== 2) return null

  const whiteTeam = teams.find((t) => t.name === "Equipo Blanco") || teams[0]
  const blackTeam = teams.find((t) => t.name === "Equipo Negro") || teams[1]

  const PlayerDot = ({
    player,
    isWhite,
    position,
  }: { player: Player; isWhite: boolean; position: { x: number; y: number } }) => (
    <div
      className={`absolute w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-125 hover:z-10 ${
        isWhite
          ? "bg-white border-gray-800 text-gray-800 shadow-lg hover:shadow-xl"
          : "bg-gray-900 border-white text-white shadow-lg hover:shadow-xl"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      title={`${player.name} - ${player.totalPoints} pts`}
    >
      {player.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()}
    </div>
  )

  const getPlayerPositions = (players: Player[], isTopTeam: boolean) => {
    const playersPerTeam = players.length
    const positions: { x: number; y: number }[] = []

    if (playersPerTeam === 0) return positions

    // Definir límites estrictos para cada equipo
    const topTeamLimits = { minY: 5, maxY: 45 } // Equipo blanco: mitad superior
    const bottomTeamLimits = { minY: 55, maxY: 95 } // Equipo negro: mitad inferior

    const limits = isTopTeam ? topTeamLimits : bottomTeamLimits

    // Portero siempre en el arco correspondiente
    const goalkeeperY = isTopTeam ? limits.minY + 3 : limits.maxY - 3
    positions.push({ x: 50, y: goalkeeperY })

    // Distribuir el resto de jugadores simétricamente DENTRO de su mitad
    const fieldPlayers = playersPerTeam - 1

    if (fieldPlayers === 0) return positions

    // Función para verificar si una posición está muy cerca de las existentes
    const isPositionValid = (newPos: { x: number; y: number }, existingPositions: { x: number; y: number }[], minDistance: number = 12) => {
      return existingPositions.every(pos => {
        const distance = Math.sqrt(Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2))
        return distance >= minDistance
      })
    }

    // Función para generar posiciones con separación mínima
    const generatePositionsWithSeparation = (targetPositions: { x: number; y: number }[], existingPositions: { x: number; y: number }[]) => {
      const validPositions: { x: number; y: number }[] = []
      
      for (const targetPos of targetPositions) {
        let finalPos = targetPos
        let attempts = 0
        const maxAttempts = 50
        
        // Si la posición inicial no es válida, intentar encontrar una cercana que sí lo sea
        while (!isPositionValid(finalPos, [...existingPositions, ...validPositions]) && attempts < maxAttempts) {
          // Generar pequeñas variaciones alrededor de la posición objetivo
          const offsetX = (Math.random() - 0.5) * 8 // Variación de hasta 4 unidades
          const offsetY = (Math.random() - 0.5) * 6 // Variación de hasta 3 unidades
          
          finalPos = {
            x: Math.max(15, Math.min(85, targetPos.x + offsetX)),
            y: Math.max(limits.minY + 5, Math.min(limits.maxY - 5, targetPos.y + offsetY))
          }
          attempts++
        }
        
        validPositions.push(finalPos)
      }
      
      return validPositions
    }

    // Nuevo algoritmo: dividir el campo en filas y distribuir jugadores con separación mínima
    const availableHeight = limits.maxY - limits.minY - 10 // Restar espacio del portero y márgenes
    const startY = isTopTeam ? limits.minY + 8 : limits.minY + 5
    
    // Definir formaciones basadas en el número de jugadores con mejor distribución
    let formation: { rows: number[], yOffsets: number[] } = { rows: [], yOffsets: [] }
    
    if (fieldPlayers === 1) {
      formation = { rows: [1], yOffsets: [availableHeight * 0.5] }
    } else if (fieldPlayers === 2) {
      formation = { rows: [1, 1], yOffsets: [availableHeight * 0.25, availableHeight * 0.75] }
    } else if (fieldPlayers === 3) {
      formation = { rows: [2, 1], yOffsets: [availableHeight * 0.2, availableHeight * 0.8] }
    } else if (fieldPlayers === 4) {
      formation = { rows: [2, 2], yOffsets: [availableHeight * 0.25, availableHeight * 0.75] }
    } else if (fieldPlayers === 5) {
      formation = { rows: [2, 2, 1], yOffsets: [availableHeight * 0.15, availableHeight * 0.5, availableHeight * 0.85] }
    } else if (fieldPlayers === 6) {
      formation = { rows: [2, 2, 2], yOffsets: [availableHeight * 0.15, availableHeight * 0.5, availableHeight * 0.85] }
    } else if (fieldPlayers === 7) {
      formation = { rows: [3, 2, 2], yOffsets: [availableHeight * 0.15, availableHeight * 0.5, availableHeight * 0.85] }
    } else if (fieldPlayers === 8) {
      formation = { rows: [3, 3, 2], yOffsets: [availableHeight * 0.15, availableHeight * 0.5, availableHeight * 0.85] }
    } else if (fieldPlayers === 9) {
      formation = { rows: [3, 3, 3], yOffsets: [availableHeight * 0.15, availableHeight * 0.5, availableHeight * 0.85] }
    } else if (fieldPlayers === 10) {
      formation = { rows: [4, 3, 3], yOffsets: [availableHeight * 0.15, availableHeight * 0.5, availableHeight * 0.85] }
    } else {
      // Para más jugadores, distribuir en múltiples filas
      const numRows = Math.min(4, Math.ceil(fieldPlayers / 3))
      const playersPerRow = Math.ceil(fieldPlayers / numRows)
      formation.rows = []
      formation.yOffsets = []
      
      for (let i = 0; i < numRows; i++) {
        const remainingPlayers = fieldPlayers - formation.rows.reduce((sum, row) => sum + row, 0)
        const playersInThisRow = Math.min(playersPerRow, remainingPlayers)
        if (playersInThisRow > 0) {
          formation.rows.push(playersInThisRow)
          formation.yOffsets.push(availableHeight * (i + 1) / (numRows + 1))
        }
      }
    }

    // Generar posiciones X para cada fila con mejor distribución
    const generateXPositionsForRow = (playersInRow: number): number[] => {
      if (playersInRow === 1) return [50]
      if (playersInRow === 2) return [25, 75]
      if (playersInRow === 3) return [20, 50, 80]
      if (playersInRow === 4) return [15, 35, 65, 85]
      if (playersInRow === 5) return [12, 28, 50, 72, 88]
      
      // Para más jugadores en una fila, distribuir con mejor separación
      const positions: number[] = []
      const totalWidth = 75 // Ancho total disponible
      const startX = 12.5 // Posición inicial
      const spacing = totalWidth / (playersInRow - 1)
      
      for (let i = 0; i < playersInRow; i++) {
        positions.push(startX + (spacing * i))
      }
      return positions
    }

    // Generar posiciones objetivo para cada fila
    const targetPositions: { x: number; y: number }[] = []
    
    formation.rows.forEach((playersInRow, rowIndex) => {
      if (playersInRow > 0) {
        const xPositions = generateXPositionsForRow(playersInRow)
        const yPosition = startY + formation.yOffsets[rowIndex]
        
        xPositions.forEach((xPos) => {
          targetPositions.push({ x: xPos, y: yPosition })
        })
      }
    })

    // Aplicar el algoritmo de separación mínima
    const finalPositions = generatePositionsWithSeparation(targetPositions, positions)
    positions.push(...finalPositions)

    return positions
  }

  const whitePositions = getPlayerPositions(whiteTeam.players, true) // Equipo blanco arriba
  const blackPositions = getPlayerPositions(blackTeam.players, false) // Equipo negro abajo

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Campo de Juego</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] md:h-[600px] bg-green-500 rounded-lg border-4 border-white overflow-hidden">
          {/* Líneas del campo - orientación vertical */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Línea central horizontal */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />

            {/* Círculo central */}
            <circle cx="50" cy="50" r="8" fill="none" stroke="white" strokeWidth="0.5" />

            {/* Áreas de portería - arriba y abajo */}
            <rect x="35" y="0" width="30" height="15" fill="none" stroke="white" strokeWidth="0.5" />
            <rect x="35" y="85" width="30" height="15" fill="none" stroke="white" strokeWidth="0.5" />

            {/* Áreas pequeñas */}
            <rect x="42" y="0" width="16" height="8" fill="none" stroke="white" strokeWidth="0.5" />
            <rect x="42" y="92" width="16" height="8" fill="none" stroke="white" strokeWidth="0.5" />

            {/* Porterías */}
            <rect x="45" y="-2" width="10" height="2" fill="white" />
            <rect x="45" y="100" width="10" height="2" fill="white" />
          </svg>

          {/* Jugadores del equipo blanco (arriba) */}
          {whiteTeam.players.map((player, index) => (
            <PlayerDot
              key={player.id}
              player={player}
              isWhite={true}
              position={whitePositions[index] || { x: 50, y: 25 }}
            />
          ))}

          {/* Jugadores del equipo negro (abajo) */}
          {blackTeam.players.map((player, index) => (
            <PlayerDot
              key={player.id}
              player={player}
              isWhite={false}
              position={blackPositions[index] || { x: 50, y: 75 }}
            />
          ))}

          {/* Leyenda de equipos - posicionada mejor para orientación vertical */}
          <div className="absolute top-2 left-2 space-y-1">
            <div className="flex items-center gap-2 bg-white/90 px-2 py-1 rounded text-xs">
              <div className="w-3 h-3 bg-white border border-gray-800 rounded-full"></div>
              <span className="font-semibold">{whiteTeam.name}</span>
              <Badge variant="outline" className="text-xs">
                {whiteTeam.totalPoints}
              </Badge>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 space-y-1">
            <div className="flex items-center gap-2 bg-black/90 px-2 py-1 rounded text-xs text-white">
              <div className="w-3 h-3 bg-gray-900 border border-white rounded-full"></div>
              <span className="font-semibold">{blackTeam.name}</span>
              <Badge variant="secondary" className="text-xs">
                {blackTeam.totalPoints}
              </Badge>
            </div>
          </div>

          {/* Indicadores de dirección */}
          <div className="absolute top-1/2 left-1 transform -translate-y-1/2 text-white text-xs font-bold bg-black/50 px-1 rounded">
            ↑ {whiteTeam.name}
          </div>
          <div className="absolute top-1/2 right-1 transform -translate-y-1/2 text-white text-xs font-bold bg-black/50 px-1 rounded">
            {blackTeam.name} ↓
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <h4 className="font-semibold mb-2">{whiteTeam.name} (Arriba)</h4>
            <div className="space-y-1">
              {whiteTeam.players.map((player) => (
                <div key={player.id} className="flex justify-between">
                  <span>{player.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {player.totalPoints}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h4 className="font-semibold mb-2">{blackTeam.name} (Abajo)</h4>
            <div className="space-y-1">
              {blackTeam.players.map((player) => (
                <div key={player.id} className="flex justify-between">
                  <span>{player.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {player.totalPoints}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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

    // Definir zonas del campo DENTRO de los límites del equipo
    const zoneHeight = (limits.maxY - limits.minY) / 3

    const zones = [
      {
        name: "defensa",
        yOffset: limits.minY + zoneHeight * 0.5,
        xPositions: [] as number[],
      },
      {
        name: "medio",
        yOffset: limits.minY + zoneHeight * 1.5,
        xPositions: [] as number[],
      },
      {
        name: "ataque",
        yOffset: limits.minY + zoneHeight * 2.5,
        xPositions: [] as number[],
      },
    ]

    // Si es equipo de abajo, invertir el orden de las zonas
    if (!isTopTeam) {
      zones.reverse()
    }

    // Distribuir jugadores en zonas según el número total
    let playersInDefense = Math.ceil(fieldPlayers * 0.4) // 40% en defensa
    let playersInMidfield = Math.ceil(fieldPlayers * 0.4) // 40% en medio
    let playersInAttack = fieldPlayers - playersInDefense - playersInMidfield // resto en ataque

    // Ajustar si hay muy pocos jugadores
    if (fieldPlayers <= 2) {
      playersInDefense = 1
      playersInMidfield = 0
      playersInAttack = fieldPlayers - 1
    } else if (fieldPlayers <= 4) {
      playersInDefense = Math.ceil(fieldPlayers / 2)
      playersInMidfield = 0
      playersInAttack = fieldPlayers - playersInDefense
    }

    // Generar posiciones X simétricas para cada zona
    const generateXPositions = (count: number): number[] => {
      if (count === 1) return [50]
      if (count === 2) return [35, 65]
      if (count === 3) return [25, 50, 75]
      if (count === 4) return [20, 40, 60, 80]

      // Para más jugadores, distribuir uniformemente
      const positions: number[] = []
      const spacing = 60 / (count + 1)
      for (let i = 1; i <= count; i++) {
        positions.push(20 + spacing * i)
      }
      return positions
    }

    // Asignar posiciones X a cada zona
    zones[0].xPositions = generateXPositions(playersInDefense)
    zones[1].xPositions = generateXPositions(playersInMidfield)
    zones[2].xPositions = generateXPositions(playersInAttack)

    // Crear posiciones finales - ASEGURAR que estén dentro de los límites
    let playerIndex = 1 // Empezar desde 1 porque el portero ya está asignado

    zones.forEach((zone) => {
      zone.xPositions.forEach((xPos) => {
        if (playerIndex < playersPerTeam) {
          // Asegurar que la posición Y esté dentro de los límites del equipo
          const yPos = Math.max(limits.minY, Math.min(limits.maxY, zone.yOffset))
          positions.push({ x: xPos, y: yPos })
          playerIndex++
        }
      })
    })

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

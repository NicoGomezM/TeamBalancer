"use client"

import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Camera, Copy } from "lucide-react"

interface Player {
  id: string
  name: string
  nickname?: string
  totalPoints: number
  hasVoted: boolean
  isPresent: boolean
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
  const fieldRef = useRef<HTMLDivElement>(null)

  if (teams.length !== 2) return null

  const whiteTeam = teams.find((t) => t.name === "Equipo Blanco") || teams[0]
  const blackTeam = teams.find((t) => t.name === "Equipo Negro") || teams[1]

  const getPlayerName = (player: Player) => {
    if (player.nickname && player.nickname !== player.name) {
      return player.nickname
    }
    return player.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  }

  const PlayerDot = ({
    player,
    isWhite,
    position,
  }: { player: Player; isWhite: boolean; position: { x: number; y: number } }) => (
    <div
      className={`absolute w-12 h-12 rounded-full border-3 flex items-center justify-center text-sm font-bold cursor-pointer transition-all hover:scale-110 hover:z-10 ${
        isWhite
          ? "bg-white border-blue-600 text-blue-800 shadow-lg hover:shadow-xl"
          : "bg-gray-900 border-red-500 text-white shadow-lg hover:shadow-xl"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      title={`${player.name} ${player.nickname ? `(${player.nickname})` : ''} - ${player.totalPoints} pts`}
    >
      {getPlayerName(player)}
    </div>
  )

  const getOptimalPositions = (players: Player[], isTopTeam: boolean) => {
    const playersCount = players.length
    const positions: { x: number; y: number }[] = []

    if (playersCount === 0) return positions

    // Definir límites más estrictos para cada equipo
    const topTeamLimits = { minY: 8, maxY: 42 }
    const bottomTeamLimits = { minY: 58, maxY: 92 }
    const limits = isTopTeam ? topTeamLimits : bottomTeamLimits

    // Formaciones predefinidas por número de jugadores
    const formations: { [key: number]: { x: number; y: number }[] } = {
      1: [{ x: 50, y: isTopTeam ? 15 : 85 }], // Solo portero
      2: [
        { x: 50, y: isTopTeam ? 15 : 85 }, // Portero
        { x: 50, y: isTopTeam ? 35 : 65 }, // Delantero
      ],
      3: [
        { x: 50, y: isTopTeam ? 15 : 85 }, // Portero
        { x: 35, y: isTopTeam ? 28 : 72 }, // Defensor izq
        { x: 65, y: isTopTeam ? 28 : 72 }, // Defensor der
      ],
      4: [
        { x: 50, y: isTopTeam ? 15 : 85 }, // Portero
        { x: 25, y: isTopTeam ? 25 : 75 }, // Defensor izq
        { x: 75, y: isTopTeam ? 25 : 75 }, // Defensor der
        { x: 50, y: isTopTeam ? 38 : 62 }, // Delantero
      ],
      5: [
        { x: 50, y: isTopTeam ? 15 : 85 }, // Portero
        { x: 25, y: isTopTeam ? 25 : 75 }, // Defensor izq
        { x: 75, y: isTopTeam ? 25 : 75 }, // Defensor der
        { x: 35, y: isTopTeam ? 35 : 65 }, // Medio izq
        { x: 65, y: isTopTeam ? 35 : 65 }, // Medio der
      ],
      6: [
        { x: 50, y: isTopTeam ? 15 : 85 }, // Portero
        { x: 25, y: isTopTeam ? 22 : 78 }, // Defensor izq
        { x: 75, y: isTopTeam ? 22 : 78 }, // Defensor der
        { x: 35, y: isTopTeam ? 30 : 70 }, // Medio izq
        { x: 65, y: isTopTeam ? 30 : 70 }, // Medio der
        { x: 50, y: isTopTeam ? 38 : 62 }, // Delantero
      ],
      7: [
        { x: 50, y: isTopTeam ? 15 : 85 }, // Portero
        { x: 20, y: isTopTeam ? 22 : 78 }, // Defensor izq
        { x: 50, y: isTopTeam ? 20 : 80 }, // Defensor central
        { x: 80, y: isTopTeam ? 22 : 78 }, // Defensor der
        { x: 30, y: isTopTeam ? 32 : 68 }, // Medio izq
        { x: 70, y: isTopTeam ? 32 : 68 }, // Medio der
        { x: 50, y: isTopTeam ? 40 : 60 }, // Delantero
      ],
    }

    // Si tenemos una formación predefinida, usarla
    if (formations[playersCount]) {
      return formations[playersCount]
    }

    // Para más jugadores, distribuir dinámicamente
    const goalkeeperY = isTopTeam ? limits.minY + 5 : limits.maxY - 5
    positions.push({ x: 50, y: goalkeeperY })

    const fieldPlayers = playersCount - 1
    const zoneHeight = (limits.maxY - limits.minY - 10) / 3

    // Distribuir en 3 líneas: defensa, medio, ataque
    const playersPerLine = Math.ceil(fieldPlayers / 3)
    
    for (let line = 0; line < 3; line++) {
      const yPosition = limits.minY + 10 + (line * zoneHeight) + (zoneHeight / 2)
      const playersInThisLine = Math.min(playersPerLine, fieldPlayers - line * playersPerLine)
      
      if (playersInThisLine > 0) {
        const spacing = 60 / (playersInThisLine + 1)
        for (let i = 0; i < playersInThisLine; i++) {
          const xPosition = 20 + spacing * (i + 1)
          if (positions.length < playersCount) {
            positions.push({ x: xPosition, y: yPosition })
          }
        }
      }
    }

    return positions.slice(0, playersCount)
  }

  const downloadField = async () => {
    try {
      // Intentar usar html2canvas si está disponible (debe cargarse dinámicamente)
      if (typeof window !== 'undefined') {
        try {
          const html2canvas = (await import('html2canvas')).default
          const canvas = await html2canvas(fieldRef.current!, {
            backgroundColor: '#22c55e',
            scale: 2,
            width: 1200,
            height: 800,
          })
          
          const link = document.createElement('a')
          link.download = `equipos-${new Date().toISOString().split('T')[0]}.png`
          link.href = canvas.toDataURL()
          link.click()
          return
        } catch (importError) {
          console.warn('html2canvas no disponible, usando fallback')
        }
      }
      
      // Fallback: copiar texto al portapapeles
      const textContent = generateTextTeams()
      await navigator.clipboard.writeText(textContent)
      alert('Equipos copiados al portapapeles (html2canvas no disponible)')
    } catch (error) {
      console.error('Error al descargar:', error)
      alert('Error al procesar la descarga')
    }
  }

  const generateTextTeams = () => {
    const date = new Date().toLocaleDateString()
    return `
🏆 EQUIPOS GENERADOS - ${date}

⚪ ${whiteTeam.name} (${whiteTeam.totalPoints} pts)
${whiteTeam.players.map((player, index) => 
  `${index + 1}. ${player.nickname && player.nickname !== player.name 
    ? `${player.name} (${player.nickname})`
    : player.name
  } - ${player.totalPoints} pts`
).join('\n')}

⚫ ${blackTeam.name} (${blackTeam.totalPoints} pts)
${blackTeam.players.map((player, index) => 
  `${index + 1}. ${player.nickname && player.nickname !== player.name 
    ? `${player.name} (${player.nickname})`
    : player.name
  } - ${player.totalPoints} pts`
).join('\n')}

📊 Diferencia: ${Math.abs(whiteTeam.totalPoints - blackTeam.totalPoints)} puntos
    `.trim()
  }

  const whitePositions = getOptimalPositions(whiteTeam.players, true)
  const blackPositions = getOptimalPositions(blackTeam.players, false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">⚽ Visualización del Campo</h3>
        <div className="flex gap-2">
          <Button onClick={downloadField} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar/Copiar
          </Button>
          <Button 
            onClick={() => navigator.clipboard.writeText(generateTextTeams())}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copiar Texto
          </Button>
        </div>
      </div>

      <div ref={fieldRef} className="relative">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full h-[600px] bg-green-500">
              {/* Campo de fútbol */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Líneas del campo */}
                <rect
                  x="5"
                  y="5"
                  width="90"
                  height="90"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
                
                {/* Línea central */}
                <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.5" />
                
                {/* Círculo central */}
                <circle cx="50" cy="50" r="8" fill="none" stroke="white" strokeWidth="0.5" />
                
                {/* Área superior */}
                <rect
                  x="25"
                  y="5"
                  width="50"
                  height="15"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
                
                {/* Área inferior */}
                <rect
                  x="25"
                  y="80"
                  width="50"
                  height="15"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
                
                {/* Área pequeña superior */}
                <rect
                  x="35"
                  y="5"
                  width="30"
                  height="8"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
                
                {/* Área pequeña inferior */}
                <rect
                  x="35"
                  y="87"
                  width="30"
                  height="8"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
                
                {/* Arcos */}
                <rect x="45" y="5" width="10" height="3" fill="none" stroke="white" strokeWidth="0.5" />
                <rect x="45" y="92" width="10" height="3" fill="none" stroke="white" strokeWidth="0.5" />
              </svg>

              {/* Jugadores del equipo blanco */}
              {whiteTeam.players.map((player, index) => (
                <PlayerDot
                  key={player.id}
                  player={player}
                  isWhite={true}
                  position={whitePositions[index] || { x: 50, y: 25 }}
                />
              ))}

              {/* Jugadores del equipo negro */}
              {blackTeam.players.map((player, index) => (
                <PlayerDot
                  key={player.id}
                  player={player}
                  isWhite={false}
                  position={blackPositions[index] || { x: 50, y: 75 }}
                />
              ))}

              {/* Etiquetas de equipos */}
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-white text-blue-800 border-blue-600">
                  {whiteTeam.name} - {whiteTeam.totalPoints} pts
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4">
                <Badge variant="outline" className="bg-gray-900 text-white border-red-500">
                  {blackTeam.name} - {blackTeam.totalPoints} pts
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de equipos para la descarga */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">{whiteTeam.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {whiteTeam.players.map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="font-medium">
                      {index + 1}. {player.nickname && player.nickname !== player.name 
                        ? `${player.name} (${player.nickname})`
                        : player.name
                      }
                    </span>
                    <Badge variant="outline">{player.totalPoints} pts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">{blackTeam.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blackTeam.players.map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">
                      {index + 1}. {player.nickname && player.nickname !== player.name 
                        ? `${player.name} (${player.nickname})`
                        : player.name
                      }
                    </span>
                    <Badge variant="outline">{player.totalPoints} pts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

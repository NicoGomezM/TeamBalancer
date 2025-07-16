"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Users, Trophy, Star, Shuffle, UserPlus, Target, LogOut, CheckCircle, Settings, Save, Trash2, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToastContext } from "@/contexts/toast-context"
import { useLoading } from "@/contexts/loading-context"
import SoccerField from "@/components/soccer-field-improved"
import ResetConfirmationModal from "@/components/ui/reset-confirmation-modal"
import { LoadingOverlay, LoadingCard } from "@/components/ui/loading"

interface Player {
  id: string
  name: string
  nickname?: string
  averagePoints: number
  voteCount: number
  hasVoted: boolean
  isPresent: boolean
}

interface Team {
  name: string
  players: Player[]
  averagePoints: number
}

export default function TeamBalancer() {
  const { user, logout } = useAuth()
  const { success, error, warning, info } = useToastContext()
  const { showLoading, hideLoading } = useLoading()

  const [players, setPlayers] = useState<Player[]>([])
  const [selectedTarget, setSelectedTarget] = useState("")
  const [pointsToAssign, setPointsToAssign] = useState("")
  const [teams, setTeams] = useState<Team[]>([])
  const [activeTab, setActiveTab] = useState("players")
  const [isLoadingVotes, setIsLoadingVotes] = useState(false)
  const [isSavingVotes, setIsSavingVotes] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false)
  const [voteValues, setVoteValues] = useState<Record<string, number>>({})
  const [groupPlayers, setGroupPlayers] = useState<any[]>([])
  const [newName, setNewName] = useState(user?.player || "")
  const [newNickname, setNewNickname] = useState(user?.nickname || "")
  const [newAvatar, setNewAvatar] = useState(user?.avatar || "👤")
  const [newGroupPlayerName, setNewGroupPlayerName] = useState("")
  const [newGroupPlayerNickname, setNewGroupPlayerNickname] = useState("")
  const [isResettingScores, setIsResettingScores] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  // Ocultar loading global cuando se complete la carga inicial
  useEffect(() => {
    if (!isLoadingData) {
      hideLoading()
    }
  }, [isLoadingData, hideLoading])

  // Emojis disponibles para avatares
  const availableEmojis = [
    '👤', '⚽', '🏃‍♂️', '🏆', '⭐', '🔥', '💪', '🎯', '🚀', '⚡',
    '🦁', '🐯', '🐺', '🦅', '🐉', '🦈', '🐻', '🐸', '🦄', '🎮',
    '🎨', '🎭', '🎪', '🎸', '🎤', '🎲', '🎊', '🎉', '👑', '💎'
  ]

  // Cargar datos cuando se inicializa el componente
  useEffect(() => {
    if (user?.group) {
      setIsLoadingData(true);
      Promise.all([
        loadPlayerStats(),
        loadGroupPlayers()
      ]).finally(() => {
        setIsLoadingData(false);
      });
    }
  }, [user])

  // Actualizar los valores del formulario cuando cambie el usuario
  useEffect(() => {
    if (user) {
      setNewName(user.player || "");
      setNewNickname(user.nickname || "");
      setNewAvatar(user.avatar || "👤");
    }
  }, [user])

  // Cargar todos los jugadores del grupo
  const loadGroupPlayers = async () => {
    if (!user?.group) return;

    try {
      setIsLoadingPlayers(true);
      showLoading('Cargando jugadores del grupo...');
      const response = await fetch(`/api/groups/${user.group}/players`);
      if (!response.ok) throw new Error('Error loading group players');
      const data = await response.json();
      setGroupPlayers(data);

      // Inicializar valores de votación
      const initialVotes: Record<string, number> = {};
      data.forEach((player: any) => {
        if (player.id !== user.id) {
          initialVotes[player.id] = 5; // Valor por defecto
        }
      });
      setVoteValues(initialVotes);
    } catch (err) {
      console.error('Error loading group players:', err);
      error('Error al cargar los jugadores del grupo');
    } finally {
      setIsLoadingPlayers(false);
      hideLoading();
    }
  };

  // Actualizar perfil del usuario
  const updateProfile = async () => {
    if (!user?.id || !newName.trim()) {
      error('Error de validación', 'El nombre es requerido')
      return
    }

    console.log('Actualizando perfil para usuario:', user.id)
    console.log('Datos a enviar:', { name: newName.trim(), nickname: newNickname.trim() || newName.trim(), avatar: newAvatar })

    setIsUpdatingProfile(true)
    showLoading('Actualizando perfil...')
    try {
      const response = await fetch(`/api/players/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          nickname: newNickname.trim() || newName.trim(),
          avatar: newAvatar
        })
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil')
      }

      success('Perfil actualizado', 'Tu información ha sido actualizada exitosamente')

      // Recargar datos para reflejar los cambios
      await loadGroupPlayers()
      await loadPlayerStats()

    } catch (err: any) {
      console.error('Error updating profile:', err)
      error('Error al actualizar', err.message || 'No se pudo actualizar el perfil')
    } finally {
      setIsUpdatingProfile(false)
      hideLoading()
    }
  }

  // Agregar jugador al grupo
  const addPlayerToGroup = async () => {
    if (!user?.group || !newGroupPlayerName.trim()) {
      error('Error de validación', 'El nombre del jugador es requerido')
      return
    }

    try {
      setIsLoadingPlayers(true);
      const response = await fetch(`/api/groups/${user.group}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now().toString(),
          name: newGroupPlayerName.trim(),
          nickname: newGroupPlayerNickname.trim() || newGroupPlayerName.trim(),
          avatar: '👤'
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al agregar jugador')
      }

      setNewGroupPlayerName('')
      setNewGroupPlayerNickname('')
      await loadGroupPlayers()
      success('Jugador agregado', `${newGroupPlayerName.trim()} ha sido agregado al grupo`)
    } catch (error: any) {
      console.error('Error adding player to group:', error)
      error('Error al agregar jugador', error.message || 'No se pudo agregar el jugador al grupo')
    } finally {
      setIsLoadingPlayers(false);
    }
  }

  // Eliminar jugador del grupo
  const removePlayerFromGroup = async (playerId: string) => {
    if (!user?.group || playerId === user.id) return

    if (!confirm('¿Estás seguro de que quieres eliminar este jugador del grupo?')) return

    try {
      setIsLoadingPlayers(true);
      const response = await fetch(`/api/groups/${user.group}/players/${playerId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al eliminar jugador')
      }

      await loadGroupPlayers()
      success('Jugador eliminado', 'El jugador ha sido eliminado del grupo')
    } catch (error: any) {
      console.error('Error removing player from group:', error)
      error('Error al eliminar jugador', error.message || 'No se pudo eliminar el jugador del grupo')
    } finally {
      setIsLoadingPlayers(false);
    }
  }

  // Resetear puntajes de todos los jugadores
  const resetAllScores = async () => {
    if (!user?.group) return

    setIsResettingScores(true)
    showLoading('Reseteando puntajes del grupo...')
    try {
      const response = await fetch(`/api/groups/${user.group}/reset-scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al resetear puntajes')
      }

      success('Puntajes reseteados', 'Todos los puntajes del grupo han sido reseteados')
      await loadPlayerStats()
      await loadGroupPlayers()
      setShowResetModal(false)
    } catch (error: any) {
      console.error('Error resetting scores:', error)
      error('Error al resetear puntajes', error.message || 'No se pudieron resetear los puntajes')
    } finally {
      setIsResettingScores(false)
      hideLoading()
    }
  }

  // Guardar todos los votos
  const saveAllVotes = async () => {
    if (!user?.group) return

    setIsSavingVotes(true)
    showLoading('Guardando todas las votaciones...')
    try {
      const votes = Object.entries(voteValues).map(([toPlayerId, points]) => ({
        groupId: user.group,
        fromPlayerId: user.id,
        toPlayerId,
        points
      }))

      const errors = []
      for (const vote of votes) {
        try {
          const response = await fetch('/api/votes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vote)
          })

          if (!response.ok) {
            const data = await response.json()
            errors.push(data.error || 'Error al guardar voto')
          }
        } catch (err) {
          errors.push('Error de conexión')
        }
      }

      if (errors.length > 0) {
        error('Error al guardar algunos votos', errors.join(', '))
        return
      }

      success('Votos guardados', 'Todos los votos han sido guardados exitosamente')
      await loadPlayerStats()
    } catch (error: any) {
      console.error('Error saving votes:', error)
      error('Error al guardar votos', error.message || 'No se pudieron guardar los votos')
    } finally {
      setIsSavingVotes(false)
      hideLoading()
    }
  }

  // Función para cargar estadísticas de jugadores desde la base de datos
  const loadPlayerStats = async () => {
    if (!user?.group) return

    try {
      const response = await fetch(`/api/groups/${user.group}/stats`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al cargar estadísticas')
      }
      const data = await response.json()

      setPlayers(data)
    } catch (error: any) {
      console.error('Error loading player stats:', error)
      error('Error al cargar estadísticas', error.message || 'No se pudieron cargar las estadísticas de los jugadores')
    }
  }

  // Función para enviar un voto
  const submitVote = async () => {
    if (!selectedTarget || !pointsToAssign || !user?.group) {
      warning('Datos incompletos', 'Por favor selecciona un jugador y asigna puntos')
      return
    }

    const points = parseInt(pointsToAssign)
    if (points < 1 || points > 10) {
      warning('Puntos inválidos', 'Los puntos deben estar entre 1 y 10')
      return
    }

    setIsLoadingVotes(true)
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: user.group,
          fromPlayerId: user.id,
          toPlayerId: selectedTarget,
          points: points
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al enviar voto')
      }

      // Recargar estadísticas después del voto
      await loadPlayerStats()

      // Limpiar formulario
      setSelectedTarget('')
      setPointsToAssign('')

      success('Voto enviado', 'Tu voto ha sido registrado exitosamente')

    } catch (error: any) {
      console.error('Error submitting vote:', error)
      error('Error al enviar voto', error.message || 'No se pudo enviar el voto')
    } finally {
      setIsLoadingVotes(false)
    }
  }

  // Función para cambiar presencia de jugador
  const togglePlayerPresence = (playerId: string) => {
    setPlayers(players.map(p =>
      p.id === playerId ? { ...p, isPresent: !p.isPresent } : p
    ));
  };

  // Función para generar equipos balanceados
  const generateTeams = () => {
    const presentPlayers = players.filter(p => p.isPresent)

    if (presentPlayers.length < 2) {
      warning('Jugadores insuficientes', 'Se necesitan al menos 2 jugadores presentes para generar equipos')
      return
    }

    // Separar jugadores con y sin puntaje
    const playersWithPoints = presentPlayers.filter(p => p.averagePoints > 0)
    const playersWithoutPoints = presentPlayers.filter(p => p.averagePoints === 0)

    // Si todos tienen 0 puntos, distribución completamente aleatoria
    if (playersWithPoints.length === 0) {
      const shuffledPlayers = [...presentPlayers].sort(() => Math.random() - 0.5)
      const half = Math.ceil(shuffledPlayers.length / 2)

      const team1 = shuffledPlayers.slice(0, half)
      const team2 = shuffledPlayers.slice(half)

      const newTeams: Team[] = [
        {
          name: 'Equipo Blanco',
          players: team1,
          averagePoints: 0
        },
        {
          name: 'Equipo Negro',
          players: team2,
          averagePoints: 0
        }
      ]

      setTeams(newTeams)
      setActiveTab('teams')
      success('Equipos generados', 'Los equipos balanceados han sido creados')
      return
    }

    // Algoritmo híbrido: balancear por puntos y agregar aleatoriedad
    const sortedPlayersWithPoints = [...playersWithPoints].sort((a, b) => b.averagePoints - a.averagePoints)
    const teamSize = Math.ceil(presentPlayers.length / 2)

    const team1: Player[] = []
    const team2: Player[] = []
    let team1Points = 0
    let team2Points = 0

    // Distribuir jugadores con puntos de forma balanceada
    sortedPlayersWithPoints.forEach((player, index) => {
      if (team1.length < teamSize && (team1Points <= team2Points || team2.length >= teamSize)) {
        team1.push(player)
        team1Points += player.averagePoints
      } else if (team2.length < teamSize) {
        team2.push(player)
        team2Points += player.averagePoints
      }
    })

    // Distribuir jugadores sin puntos aleatoriamente
    const shuffledPlayersWithoutPoints = [...playersWithoutPoints].sort(() => Math.random() - 0.5)

    shuffledPlayersWithoutPoints.forEach(player => {
      if (team1.length < teamSize) {
        team1.push(player)
      } else if (team2.length < teamSize) {
        team2.push(player)
      } else {
        // Si ambos equipos están "llenos", distribuir aleatoriamente
        if (Math.random() < 0.5) {
          team1.push(player)
        } else {
          team2.push(player)
        }
      }
    })

    // Agregar aleatoriedad final si los equipos están muy balanceados
    if (Math.abs(team1Points - team2Points) <= 1 && playersWithoutPoints.length > 0) {
      const team1WithoutPoints = team1.filter(p => p.averagePoints === 0)
      const team2WithoutPoints = team2.filter(p => p.averagePoints === 0)

      if (team1WithoutPoints.length > 0 && team2WithoutPoints.length > 0 && Math.random() < 0.3) {
        const randomIndex1 = Math.floor(Math.random() * team1WithoutPoints.length)
        const randomIndex2 = Math.floor(Math.random() * team2WithoutPoints.length)

        const team1Index = team1.findIndex(p => p.id === team1WithoutPoints[randomIndex1].id)
        const team2Index = team2.findIndex(p => p.id === team2WithoutPoints[randomIndex2].id)

        if (team1Index !== -1 && team2Index !== -1) {
          const temp = team1[team1Index]
          team1[team1Index] = team2[team2Index]
          team2[team2Index] = temp
        }
      }
    }

    // Recalcular puntos finales
    const finalTeam1Points = team1.reduce((sum, p) => sum + p.averagePoints, 0)
    const finalTeam2Points = team2.reduce((sum, p) => sum + p.averagePoints, 0)

    const newTeams: Team[] = [
      {
        name: 'Equipo Blanco',
        players: team1,
        averagePoints: Math.round(finalTeam1Points * 100) / 100
      },
      {
        name: 'Equipo Negro',
        players: team2,
        averagePoints: Math.round(finalTeam2Points * 100) / 100
      }
    ]

    setTeams(newTeams)
    setActiveTab('teams')
    success('Equipos generados', 'Los equipos balanceados han sido creados')
  }

  // Función para generar equipos completamente aleatorios
  const generateRandomTeams = () => {
    const presentPlayers = players.filter(p => p.isPresent)

    if (presentPlayers.length < 2) {
      warning('Jugadores insuficientes', 'Se necesitan al menos 2 jugadores presentes para generar equipos')
      return
    }

    // Distribución completamente aleatoria
    const shuffledPlayers = [...presentPlayers].sort(() => Math.random() - 0.5)
    const half = Math.ceil(shuffledPlayers.length / 2)

    const team1 = shuffledPlayers.slice(0, half)
    const team2 = shuffledPlayers.slice(half)

    const team1Points = team1.reduce((sum, p) => sum + p.averagePoints, 0)
    const team2Points = team2.reduce((sum, p) => sum + p.averagePoints, 0)

    const newTeams: Team[] = [
      {
        name: 'Equipo Blanco',
        players: team1,
        averagePoints: Math.round(team1Points * 100) / 100
      },
      {
        name: 'Equipo Negro',
        players: team2,
        averagePoints: Math.round(team2Points * 100) / 100
      }
    ]

    setTeams(newTeams)
    setActiveTab('teams')
    success('Equipos aleatorios generados', 'Los equipos completamente aleatorios han sido creados')
  }

  // Función para limpiar equipos
  const clearTeams = () => {
    setTeams([]);
    setActiveTab('players');
  };

  // Filtrar jugadores para votación (excluir al usuario actual)
  const availableTargets = players.filter(p => p.id !== user?.id && p.isPresent);
  const presentPlayers = players.filter(p => p.isPresent);
  const currentPlayer = players.find(p => p.id === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-7xl mx-auto">
          <LoadingCard message="Cargando aplicación..." />
        </div>
      </div>
    );
  }

  // if (isLoadingData) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
  //       <div className="max-w-7xl mx-auto">
  //         <LoadingCard message="Cargando datos del grupo..." />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Team Balancer</h1>
              <p className="text-gray-600">Grupo: {user.group}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user.avatar} {user.nickname}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="players">
              <Users className="w-4 h-4 mr-2" />
              Jugadores
            </TabsTrigger>
            <TabsTrigger value="voting">
              <Target className="w-4 h-4 mr-2" />
              Votación
            </TabsTrigger>
            <TabsTrigger value="teams">
              <Trophy className="w-4 h-4 mr-2" />
              Equipos
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Gestión de Jugadores
                </CardTitle>
                <CardDescription>
                  Selecciona quién va a jugar hoy. Solo los jugadores presentes participarán en el balanceo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingOverlay isLoading={isLoadingPlayers} message="Cargando jugadores...">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map((player) => (
                      <Card key={player.id} className={`p-4 ${player.isPresent ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={player.isPresent}
                              onCheckedChange={() => togglePlayerPresence(player.id)}
                            />
                            <div>
                              <p className="font-medium">
                                {player.nickname && player.nickname !== player.name
                                  ? `${player.name} (${player.nickname})`
                                  : player.name
                                }
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Badge variant="outline">
                                  {player.averagePoints > 0 ? `${player.averagePoints} pts` : 'Sin votos'}
                                </Badge>
                                <span>({player.voteCount} votos)</span>
                                {player.hasVoted && <CheckCircle className="w-4 h-4 text-green-500" />}
                              </div>
                            </div>
                          </div>
                        </div>
                    </Card>
                  ))}
                </div>
                </LoadingOverlay>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <strong>{presentPlayers.length}</strong> jugadores presentes de {players.length} total
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={generateTeams}
                      disabled={presentPlayers.length < 2}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Equipos Balanceados
                    </Button>
                    <Button
                      onClick={generateRandomTeams}
                      disabled={presentPlayers.length < 2}
                      variant="outline"
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Aleatorios
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Sistema de Votación
                </CardTitle>
                <CardDescription>
                  Evalúa a todos tus compañeros moviendo las barras. Los puntos se promedian automáticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {groupPlayers
                    .filter(player => player.id !== user?.id && player.isActive)
                    .map((player) => (
                      <div key={player.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            {player.nickname && player.nickname !== player.name
                              ? `${player.name} (${player.nickname})`
                              : player.name
                            }
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {voteValues[player.id] || 5} pts
                          </Badge>
                        </div>
                        <Slider
                          value={[voteValues[player.id] || 5]}
                          onValueChange={(value) => {
                            setVoteValues(prev => ({
                              ...prev,
                              [player.id]: value[0]
                            }));
                          }}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1</span>
                          <span>5</span>
                          <span>10</span>
                        </div>
                      </div>
                    ))}
                </div>

                {groupPlayers.filter(player => player.id !== user?.id && player.isActive).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay otros jugadores activos para votar</p>
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={saveAllVotes}
                    disabled={isSavingVotes || groupPlayers.filter(p => p.id !== user?.id && p.isActive).length === 0}
                    className="w-full max-w-md bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSavingVotes ? 'Guardando...' : 'Guardar Todas las Votaciones'}
                  </Button>
                </div>

                {/* Estado de votación del usuario actual */}
                {currentPlayer && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Tu estado:</strong> {currentPlayer.hasVoted ?
                        `✅ Has votado (${currentPlayer.voteCount} votos dados)` :
                        '❌ No has votado aún'
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tu promedio actual: {currentPlayer.averagePoints > 0 ?
                        `${currentPlayer.averagePoints} pts (${currentPlayer.voteCount} votos recibidos)` :
                        'Sin votos recibidos'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            {teams.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Equipos Generados</h3>
                  <Button onClick={clearTeams} variant="outline">
                    Limpiar Equipos
                  </Button>
                </div>

                <SoccerField teams={teams} />
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No hay equipos generados
                  </h3>
                  <p className="text-gray-500 text-center">
                    Ve a la pestaña de Jugadores para seleccionar quién va a jugar y generar equipos balanceados.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración de Perfil
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nickname">Apodo</Label>
                    <Input
                      id="nickname"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      placeholder="Tu apodo (opcional)"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="avatar">Avatar</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{newAvatar}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewAvatar("👤")}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-10 gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                        {availableEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setNewAvatar(emoji)}
                            className={`text-xl p-2 rounded hover:bg-gray-100 transition-colors ${newAvatar === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                              }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={updateProfile}
                    disabled={!newName.trim() || isUpdatingProfile}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                    onClick={() => {
                      setNewName(user?.player || "");
                      setNewNickname(user?.nickname || "");
                      setNewAvatar(user?.avatar || "👤");
                    }}
                    variant="outline"
                    disabled={isUpdatingProfile}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Gestión del Grupo
                </CardTitle>
                <CardDescription>
                  Administra los jugadores del grupo {user?.group}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nombre del nuevo jugador"
                    value={newGroupPlayerName}
                    onChange={(e) => setNewGroupPlayerName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Apodo del nuevo jugador"
                    value={newGroupPlayerNickname}
                    onChange={(e) => setNewGroupPlayerNickname(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={addPlayerToGroup}
                    disabled={!newGroupPlayerName.trim()}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Jugadores del Grupo</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {groupPlayers.map((player) => (
                      <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg border ${player.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{player.avatar || '👤'}</span>
                          <div>
                            <span className="font-medium">
                              {player.nickname && player.nickname !== player.name
                                ? `${player.name} (${player.nickname})`
                                : player.name
                              }
                            </span>
                            <Badge variant={player.isActive ? "default" : "secondary"} className="ml-2">
                              {player.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {player.id !== user?.id && (
                            <Button
                              onClick={() => removePlayerFromGroup(player.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {groupPlayers.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hay jugadores en el grupo</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración Avanzada
                </CardTitle>
                <CardDescription>
                  Configuraciones que afectan a todo el grupo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Botones de prueba para notificaciones */}
                {/* <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-2">Probar Notificaciones</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => success('¡Éxito!', 'Esta es una notificación de éxito')}
                      variant="outline"
                      size="sm"
                      className="bg-green-50 text-green-600 hover:bg-green-100"
                    >
                      ✅ Éxito
                    </Button>
                    <Button
                      onClick={() => error('Error', 'Esta es una notificación de error')}
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      ❌ Error
                    </Button>
                    <Button
                      onClick={() => warning('Advertencia', 'Esta es una notificación de advertencia')}
                      variant="outline"
                      size="sm"
                      className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                    >
                      ⚠️ Advertencia
                    </Button>
                    <Button
                      onClick={() => info('Información', 'Esta es una notificación informativa')}
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      ℹ️ Info
                    </Button>
                  </div>
                </div> */}

                {/* Debug - Información del usuario */}
                {/* <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2">Debug - Información del Usuario</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>ID:</strong> {user?.id || 'No disponible'}</p>
                    <p><strong>Nombre:</strong> {user?.player || 'No disponible'}</p>
                    <p><strong>Nickname:</strong> {user?.nickname || 'No disponible'}</p>
                    <p><strong>Avatar:</strong> {user?.avatar || 'No disponible'}</p>
                    <p><strong>Grupo:</strong> {user?.group || 'No disponible'}</p>
                  </div>
                  <Button
                    onClick={() => console.log('Usuario completo:', user)}
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    🔍 Ver en Consola
                  </Button>
                </div> */}

                <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2">Panel de Administración</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Accede al panel de administración para gestionar todos los grupos del sistema.
                  </p>
                  <Button
                    onClick={() => window.open('/admin', '_blank')}
                    variant="outline"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Abrir Panel de Administración
                  </Button>
                </div>

                <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">Resetear Puntajes</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Esto eliminará todos los votos y puntajes de todos los jugadores del grupo. Esta acción no se puede deshacer.
                  </p>
                  <Button
                    onClick={() => setShowResetModal(true)}
                    disabled={isResettingScores}
                    variant="outline"
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isResettingScores ? 'Reseteando...' : 'Resetear Todos los Puntajes'}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de confirmación para resetear puntajes */}
      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetAllScores}
        groupName={user?.group || ""}
        playerCount={groupPlayers.length}
        isResetting={isResettingScores}
      />
    </div>
  )
}

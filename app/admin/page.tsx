"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToastContext } from '@/contexts/toast-context'
import {
    Users,
    Shield,
    Eye,
    EyeOff,
    Plus,
    Edit2,
    Trash2,
    Settings,
    Database,
    UserPlus,
    Activity,
    TrendingUp,
    Calendar
} from 'lucide-react'

interface GroupData {
    id: string
    name: string
    icon: string
    color: string
    players: Array<{
        id: string
        name: string
        nickname: string
        avatar: string
        isActive: boolean
    }>
    isActive: boolean
    createdAt: string
    playerCount: number
    activePlayerCount: number
}

interface Stats {
    totalGroups: number
    totalPlayers: number
    activeGroups: number
    activePlayers: number
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [groups, setGroups] = useState<GroupData[]>([])
    const [stats, setStats] = useState<Stats>({
        totalGroups: 0,
        totalPlayers: 0,
        activeGroups: 0,
        activePlayers: 0
    })
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupIcon, setNewGroupIcon] = useState('🎓')
    const [newGroupColor, setNewGroupColor] = useState('bg-blue-500')
    const [isCreatingGroup, setIsCreatingGroup] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    const { success, error, warning, info } = useToastContext()

    // Iconos disponibles para grupos
    const availableIcons = [
        '🎓', '⚽', '🏀', '🏈', '🎾', '🏐', '🏓', '⚾', '🥅', '🎯',
        '🎮', '🎲', '🎪', '🎭', '🎨', '🎸', '🎤', '🎵', '🎶', '🎹',
        '🔥', '⭐', '💎', '🏆', '🥇', '🎊', '🎉', '👑', '🚀', '⚡'
    ]

    // Colores disponibles para grupos
    const availableColors = [
        { name: 'Azul', class: 'bg-blue-500' },
        { name: 'Verde', class: 'bg-green-500' },
        { name: 'Rojo', class: 'bg-red-500' },
        { name: 'Amarillo', class: 'bg-yellow-500' },
        { name: 'Púrpura', class: 'bg-purple-500' },
        { name: 'Rosa', class: 'bg-pink-500' },
        { name: 'Índigo', class: 'bg-indigo-500' },
        { name: 'Naranja', class: 'bg-orange-500' },
        { name: 'Turquesa', class: 'bg-teal-500' },
        { name: 'Gris', class: 'bg-gray-500' }
    ]

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (response.ok) {
                setIsAuthenticated(true)
                success('Acceso autorizado', 'Bienvenido al panel de administración')
                loadGroups()
                loadStats()
            } else {
                error('Acceso denegado', 'Contraseña incorrecta')
                setPassword('')
            }
        } catch (err) {
            error('Error de conexión', 'No se pudo verificar la contraseña')
        } finally {
            setIsLoading(false)
        }
    }

    const loadGroups = async () => {
        try {
            const response = await fetch('/api/admin/groups')
            if (response.ok) {
                const data = await response.json()
                setGroups(data)
            }
        } catch (err) {
            error('Error al cargar grupos', 'No se pudieron cargar los grupos')
        }
    }

    const loadStats = async () => {
        try {
            const response = await fetch('/api/admin/stats')
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (err) {
            error('Error al cargar estadísticas', 'No se pudieron cargar las estadísticas')
        }
    }

    const createGroup = async () => {
        if (!newGroupName.trim()) {
            warning('Nombre requerido', 'El nombre del grupo es obligatorio')
            return
        }

        setIsCreatingGroup(true)
        try {
            const response = await fetch('/api/admin/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newGroupName.trim(),
                    icon: newGroupIcon,
                    color: newGroupColor
                })
            })

            if (response.ok) {
                success('Grupo creado', `El grupo "${newGroupName}" ha sido creado exitosamente`)
                setNewGroupName('')
                setNewGroupIcon('🎓')
                setNewGroupColor('bg-blue-500')
                loadGroups()
                loadStats()
            } else {
                const data = await response.json()
                error('Error al crear grupo', data.error || 'No se pudo crear el grupo')
            }
        } catch (err) {
            error('Error de conexión', 'No se pudo crear el grupo')
        } finally {
            setIsCreatingGroup(false)
        }
    }

    const toggleGroupStatus = async (groupId: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/admin/groups/${groupId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive })
            })

            if (response.ok) {
                success(
                    !isActive ? 'Grupo activado' : 'Grupo desactivado',
                    `El grupo ha sido ${!isActive ? 'activado' : 'desactivado'} exitosamente`
                )
                loadGroups()
                loadStats()
            } else {
                error('Error al actualizar grupo', 'No se pudo cambiar el estado del grupo')
            }
        } catch (err) {
            error('Error de conexión', 'No se pudo actualizar el grupo')
        }
    }

    const deleteGroup = async (groupId: string, groupName: string) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar el grupo "${groupName}"? Esta acción no se puede deshacer.`)) {
            return
        }

        try {
            const response = await fetch(`/api/admin/groups/${groupId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                success('Grupo eliminado', `El grupo "${groupName}" ha sido eliminado exitosamente`)
                loadGroups()
                loadStats()
            } else {
                error('Error al eliminar grupo', 'No se pudo eliminar el grupo')
            }
        } catch (err) {
            error('Error de conexión', 'No se pudo eliminar el grupo')
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-between items-center mb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = '/'}
                                className="text-sm text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                                ← Volver al Inicio
                            </Button>
                            <div className="flex-1"></div>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Panel de Administración</CardTitle>
                        <CardDescription>
                            Ingresa la contraseña para acceder al panel de gestión de grupos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña de Administrador</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ingresa la contraseña"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                disabled={isLoading || !password.trim()}
                            >
                                {isLoading ? 'Verificando...' : 'Acceder'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                            <p className="text-gray-600">Gestión de grupos y usuarios</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Volver a la App
                        </Button>
                        <Button
                            onClick={() => setIsAuthenticated(false)}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Shield className="w-4 h-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">
                            <Activity className="w-4 h-4 mr-2" />
                            Resumen
                        </TabsTrigger>
                        <TabsTrigger value="groups">
                            <Users className="w-4 h-4 mr-2" />
                            Grupos
                        </TabsTrigger>
                        <TabsTrigger value="create">
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Grupo
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        {/* Estadísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">{stats.totalGroups}</p>
                                            <p className="text-sm text-gray-600">Grupos Totales</p>
                                        </div>
                                        <Database className="w-8 h-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">{stats.activeGroups}</p>
                                            <p className="text-sm text-gray-600">Grupos Activos</p>
                                        </div>
                                        <Activity className="w-8 h-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-purple-600">{stats.totalPlayers}</p>
                                            <p className="text-sm text-gray-600">Jugadores Totales</p>
                                        </div>
                                        <UserPlus className="w-8 h-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-orange-600">{stats.activePlayers}</p>
                                            <p className="text-sm text-gray-600">Jugadores Activos</p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Lista de grupos recientes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Grupos Recientes</CardTitle>
                                <CardDescription>Últimos grupos creados o modificados</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {groups.slice(0, 5).map((group) => (
                                        <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${group.color} rounded-full flex items-center justify-center`}>
                                                    <span className="text-white text-lg">{group.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{group.name}</p>
                                                    <p className="text-sm text-gray-600">{group.playerCount} jugadores</p>
                                                </div>
                                            </div>
                                            <Badge variant={group.isActive ? "default" : "secondary"}>
                                                {group.isActive ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="groups" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestión de Grupos</CardTitle>
                                <CardDescription>
                                    Administra todos los grupos existentes en el sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {groups.map((group) => (
                                        <div key={group.id} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 ${group.color} rounded-full flex items-center justify-center`}>
                                                        <span className="text-white text-xl">{group.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{group.name}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span>ID: {group.id}</span>
                                                            <span>Jugadores: {group.playerCount}</span>
                                                            <span>Activos: {group.activePlayerCount}</span>
                                                            <span>Creado: {new Date(group.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={group.isActive ? "default" : "secondary"}>
                                                        {group.isActive ? "Activo" : "Inactivo"}
                                                    </Badge>
                                                    <Button
                                                        onClick={() => toggleGroupStatus(group.id, group.isActive)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        {group.isActive ? "Desactivar" : "Activar"}
                                                    </Button>
                                                    <Button
                                                        onClick={() => deleteGroup(group.id, group.name)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Lista de jugadores del grupo */}
                                            <div className="mt-4">
                                                <h4 className="font-medium mb-2">Jugadores del Grupo:</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {group.players.map((player) => (
                                                        <div key={player.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                                            <span className="text-lg">{player.avatar}</span>
                                                            <span className="font-medium">{player.name}</span>
                                                            {player.nickname !== player.name && (
                                                                <span className="text-gray-500">({player.nickname})</span>
                                                            )}
                                                            <Badge variant={player.isActive ? "default" : "secondary"} className="ml-auto">
                                                                {player.isActive ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="create" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Crear Nuevo Grupo</CardTitle>
                                <CardDescription>
                                    Crea un nuevo grupo para organizar jugadores
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="groupName">Nombre del Grupo</Label>
                                    <Input
                                        id="groupName"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        placeholder="Ingresa el nombre del grupo"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="groupIcon">Icono del Grupo</Label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={`w-12 h-12 ${newGroupColor} rounded-full flex items-center justify-center`}>
                                            <span className="text-white text-xl">{newGroupIcon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="grid grid-cols-10 gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                                                {availableIcons.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        type="button"
                                                        onClick={() => setNewGroupIcon(icon)}
                                                        className={`text-xl p-2 rounded hover:bg-gray-100 transition-colors ${newGroupIcon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                                                            }`}
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="groupColor">Color del Grupo</Label>
                                    <div className="grid grid-cols-5 gap-2 mt-2">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color.class}
                                                type="button"
                                                onClick={() => setNewGroupColor(color.class)}
                                                className={`w-full h-10 ${color.class} rounded-lg transition-all hover:scale-105 ${newGroupColor === color.class ? 'ring-2 ring-gray-800' : ''
                                                    }`}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={createGroup}
                                    disabled={!newGroupName.trim() || isCreatingGroup}
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {isCreatingGroup ? 'Creando...' : 'Crear Grupo'}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

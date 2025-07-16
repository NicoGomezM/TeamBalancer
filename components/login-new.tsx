import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, Trophy, Star, Gamepad2, Shield, Target, Database, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLoading } from '@/contexts/loading-context';

interface Group {
  id: string;
  name: string;
  icon: string;
  color: string;
  players: Player[];
  isActive: boolean;
}

interface Player {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  isActive: boolean;
}

export default function Login() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  // Cargar grupos al montar el componente
  useEffect(() => {
    fetchGroups();
  }, []);

  // Cargar jugadores cuando se selecciona un grupo
  useEffect(() => {
    if (selectedGroup) {
      fetchPlayers(selectedGroup);
    } else {
      setPlayers([]);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      showLoading('Cargando grupos disponibles...');
      const response = await fetch('/api/groups');
      if (!response.ok) throw new Error('Error loading groups');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Error cargando grupos');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const fetchPlayers = async (groupId: string) => {
    try {
      showLoading('Cargando jugadores del grupo...');
      const response = await fetch(`/api/groups/${groupId}/players`);
      if (!response.ok) throw new Error('Error loading players');
      const data = await response.json();
      setPlayers(data.filter((p: Player) => p.isActive));
    } catch (error) {
      console.error('Error fetching players:', error);
      setError('Error cargando jugadores');
    } finally {
      hideLoading();
    }
  };

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      showLoading('Inicializando base de datos...');
      const response = await fetch('/api/init-db', { method: 'POST' });
      if (!response.ok) throw new Error('Error initializing database');
      await fetchGroups();
      setError('');
    } catch (error) {
      console.error('Error initializing database:', error);
      setError('Error inicializando base de datos');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const handleLogin = () => {
    if (selectedGroup && selectedPlayer) {
      const selectedPlayerData = players.find(p => p.id === selectedPlayer);
      if (selectedPlayerData) {
        showLoading('Iniciando sesión...');
        login(selectedGroup, selectedPlayerData.name);
        // El hideLoading() se llamará cuando el usuario se autentique correctamente
      }
    }
  };

  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8" />
            Team Balancer
          </CardTitle>
          <CardDescription className="text-center text-blue-100 text-lg">
            Selecciona tu grupo y jugador para comenzar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          {/* Botón para inicializar DB */}
          {groups.length === 0 && !loading && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">No hay grupos disponibles</p>
              <Button
                onClick={initializeDatabase}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={loading}
              >
                <Database className="w-4 h-4 mr-2" />
                {loading ? 'Inicializando...' : 'Inicializar Base de Datos'}
              </Button>
            </div>
          )}

          {/* Botón para refrescar */}
          {groups.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={fetchGroups}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refrescar
              </Button>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Selección de grupo */}
          <div className="space-y-2">
            <Label htmlFor="group-select" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              Selecciona tu Grupo
              <div className="relative group">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help hover:bg-blue-600 transition-colors">
                  ?
                </span>
                <div className="absolute left-0 top-7 w-80 bg-gray-900 text-white text-sm rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-xl border border-gray-700">
                  <div className="absolute -top-2 left-3 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
                  <p className="mb-2">Si no tienes grupo contactate con el administrador para que te cree uno:</p>
                  <p className="text-blue-300 font-medium break-all">nicolas.gomez2101@alumnos.ubiobio.cl</p>
                </div>
              </div>
            </Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup} disabled={loading}>
              <SelectTrigger id="group-select" className="h-12 text-lg">
                <SelectValue placeholder="Elige un grupo..." />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{group.icon}</span>
                      <span className="font-medium">{group.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información del grupo seleccionado */}
          {selectedGroupData && (
            <div className={`p-4 rounded-lg ${selectedGroupData.color.replace('bg-', 'bg-').replace('-500', '-100')} border-2 ${selectedGroupData.color.replace('bg-', 'border-').replace('-500', '-300')}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{selectedGroupData.icon}</span>
                <h3 className="text-xl font-bold text-gray-800">{selectedGroupData.name}</h3>
              </div>
              <p className="text-gray-600">
                {selectedGroupData.players.length} jugadores disponibles
              </p>
            </div>
          )}

          {/* Selección de jugador */}
          {selectedGroup && players.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="player-select" className="text-lg font-semibold text-gray-700">
                Selecciona tu Jugador
              </Label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger id="player-select" className="h-12 text-lg">
                  <SelectValue placeholder="Elige tu jugador..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{player.avatar}</span>
                        <span className="font-medium">
                          {player.nickname && player.nickname !== player.name
                            ? `${player.name} (${player.nickname})`
                            : player.name
                          }
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Botón de login */}
          <Button
            onClick={handleLogin}
            disabled={!selectedGroup || !selectedPlayer || loading}
            className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
          >
            <Users className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Button>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Características
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <Target className="w-3 h-3" />
                Sistema de votación para evaluar habilidades
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Algoritmo inteligente para equipos balanceados
              </li>
              <li className="flex items-center gap-2">
                <Gamepad2 className="w-3 h-3" />
                Gestión de presencia y estado de jugadores
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

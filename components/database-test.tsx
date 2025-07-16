import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTeamBalance, useSessions } from '@/hooks/use-team-balance';

export default function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string>('');
  const { sessions, loading: sessionsLoading, error: sessionsError, loadSessions } = useSessions();
  const { saveTeamBalance, loadTeamBalance, loading: teamLoading, error: teamError } = useTeamBalance('test-session');

  const testBasicConnection = async () => {
    setConnectionStatus('connecting');
    setTestResult('');

    try {
      const response = await fetch('/api/test-connection');
      const result = await response.json();
      
      if (result.success) {
        setConnectionStatus('connected');
        setTestResult(`✅ Conexión básica exitosa!\nBase de datos: ${result.database}\nEstado: ${result.connectionState}`);
      } else {
        setConnectionStatus('error');
        setTestResult(`❌ Error de conexión: ${result.message}\nDetalle: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      setTestResult(`❌ Error de red: ${error}`);
    }
  };

  const testFullConnection = async () => {
    setConnectionStatus('connecting');
    setTestResult('');

    try {
      // Crear datos de prueba
      const testPlayers = [
        { id: '1', name: 'Juan', position: 'Delantero', skill: 8, isPresent: true },
        { id: '2', name: 'Pedro', position: 'Medio', skill: 7, isPresent: true },
        { id: '3', name: 'Luis', position: 'Defensa', skill: 6, isPresent: true },
        { id: '4', name: 'Carlos', position: 'Portero', skill: 9, isPresent: true }
      ];

      const testTeams = [
        { name: 'Equipo A', players: [testPlayers[0], testPlayers[1]], totalSkill: 15 },
        { name: 'Equipo B', players: [testPlayers[2], testPlayers[3]], totalSkill: 15 }
      ];

      // Intentar guardar datos
      const saveResult = await saveTeamBalance(testPlayers, testTeams);
      
      if (saveResult) {
        setConnectionStatus('connected');
        setTestResult('✅ Conexión completa exitosa! Datos guardados y recuperados correctamente.');
      } else {
        setConnectionStatus('error');
        setTestResult(`❌ Error al guardar datos: ${teamError}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      setTestResult(`❌ Error completo: ${error}`);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test de Conexión MongoDB
          <Badge className={getStatusColor()}>
            {connectionStatus === 'idle' && 'Sin probar'}
            {connectionStatus === 'connecting' && 'Conectando...'}
            {connectionStatus === 'connected' && 'Conectado'}
            {connectionStatus === 'error' && 'Error'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Prueba la conexión a MongoDB Atlas y guarda datos de ejemplo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testBasicConnection} 
            disabled={connectionStatus === 'connecting'}
            variant="outline"
            className="flex-1"
          >
            {connectionStatus === 'connecting' ? 'Probando...' : 'Prueba Básica'}
          </Button>
          
          <Button 
            onClick={testFullConnection} 
            disabled={connectionStatus === 'connecting' || teamLoading}
            className="flex-1"
          >
            {connectionStatus === 'connecting' ? 'Probando...' : 'Prueba Completa'}
          </Button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-100 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        {teamError && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-700">Error: {teamError}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Sesiones Guardadas:</h3>
          <Button 
            onClick={loadSessions} 
            disabled={sessionsLoading}
            variant="outline"
            size="sm"
          >
            {sessionsLoading ? 'Cargando...' : 'Recargar Sesiones'}
          </Button>
          
          {sessionsError && (
            <p className="text-sm text-red-600 mt-2">Error: {sessionsError}</p>
          )}
          
          <div className="mt-2 space-y-2">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div key={session._id} className="p-2 bg-gray-50 rounded text-sm">
                  <strong>ID:</strong> {session.sessionId} | 
                  <strong> Creado:</strong> {new Date(session.createdAt).toLocaleString()} |
                  <strong> Actualizado:</strong> {new Date(session.updatedAt).toLocaleString()}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No hay sesiones guardadas</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

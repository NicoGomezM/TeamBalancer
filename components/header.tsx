import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, LogOut, User, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function Header() {
  const { user, logout } = useAuth();

  const getGroupIcon = (group: string) => {
    if (group.toLowerCase().includes('futbol')) return '⚽';
    if (group.toLowerCase().includes('basquet')) return '🏀';
    if (group.toLowerCase().includes('volley')) return '🏐';
    if (group.toLowerCase().includes('tenis')) return '🎾';
    if (group.toLowerCase().includes('padel')) return '🏓';
    return '🏆';
  };

  const getGroupColor = (group: string) => {
    if (group.toLowerCase().includes('futbol')) return 'bg-green-500';
    if (group.toLowerCase().includes('basquet')) return 'bg-orange-500';
    if (group.toLowerCase().includes('volley')) return 'bg-purple-500';
    if (group.toLowerCase().includes('tenis')) return 'bg-yellow-500';
    if (group.toLowerCase().includes('padel')) return 'bg-pink-500';
    return 'bg-blue-500';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Team Balancer</h1>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {getCurrentDate()}
              </p>
            </div>
          </div>

          {/* Información del usuario */}
          {user && (
            <div className="flex items-center gap-4">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${getGroupColor(user.group)} flex items-center justify-center text-white font-bold`}>
                        {getGroupIcon(user.group)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.group}</p>
                        <p className="text-xs text-white/70 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {user.player}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Salir
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { IPlayer, ITeam } from '@/lib/models';

interface TeamBalanceData {
  sessionId: string;
  players: IPlayer[];
  teams: ITeam[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const useTeamBalance = (sessionId: string) => {
  const [data, setData] = useState<TeamBalanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTeamBalance = async (players: IPlayer[], teams: ITeam[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          players,
          teams
        }),
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        return result.data;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err) {
      setError('Error saving team balance');
      console.error('Error saving team balance:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadTeamBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/teams?sessionId=${sessionId}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        return result.data;
      } else {
        setError(result.message);
        return null;
      }
    } catch (err) {
      setError('Error loading team balance');
      console.error('Error loading team balance:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadTeamBalance();
    }
  }, [sessionId]);

  return {
    data,
    loading,
    error,
    saveTeamBalance,
    loadTeamBalance
  };
};

export const useSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sessions');
      const result = await response.json();

      if (result.success) {
        setSessions(result.data);
        return result.data;
      } else {
        setError(result.message);
        return [];
      }
    } catch (err) {
      setError('Error loading sessions');
      console.error('Error loading sessions:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    loadSessions
  };
};

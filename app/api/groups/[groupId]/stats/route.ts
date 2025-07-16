import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Vote, Group } from '@/lib/models';
import { cache } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = await params;
    
    // Verificar cache
    const cacheKey = `player_stats_${groupId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    await connectToDatabase();

    // Obtener el grupo
    const group = await Group.findOne({ id: groupId, isActive: true });
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Obtener todos los votos del grupo
    const votes = await Vote.find({ groupId });

    // Calcular estadísticas para cada jugador
    const playerStats = await Promise.all(
      group.players
        .filter((player: typeof group.players[0]) => player.isActive)
        .map(async (player: typeof group.players[0]) => {
          // Votos recibidos por este jugador
          const receivedVotes = votes.filter(vote => vote.toPlayerId === player.id);
          
          // Votos dados por este jugador
          const givenVotes = votes.filter(vote => vote.fromPlayerId === player.id);
          
          const totalPoints = receivedVotes.reduce((sum, vote) => sum + vote.points, 0);
          const voteCount = receivedVotes.length;
          const averagePoints = voteCount > 0 ? Math.round((totalPoints / voteCount) * 100) / 100 : 0;
          
          // Verificar si este jugador ya votó
          const hasVoted = givenVotes.length > 0;
          
          return {
            id: player.id,
            name: player.name,
            nickname: player.nickname,
            groupId: groupId,
            totalPoints,
            voteCount,
            averagePoints,
            isPresent: true, // Default, se puede cambiar desde el frontend
            hasVoted
          };
        })
    );

    // Guardar en cache por 2 minutos
    cache.set(cacheKey, playerStats, 120);
    
    return NextResponse.json(playerStats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json({ error: 'Error fetching player stats' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Group, IGroupPlayer } from '@/lib/models';
import { cache } from '@/lib/cache';

interface GroupWithPlayers {
  players: IGroupPlayer[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = await params;
    
    // Verificar cache primero
    const cacheKey = `group_players_${groupId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    await connectToDatabase();
    
    // Usar agregación para filtrar jugadores activos directamente en la consulta
    const result = await Group.aggregate([
      { $match: { id: groupId, isActive: true } },
      { $project: { 
          players: { 
            $filter: { 
              input: '$players', 
              cond: { $eq: ['$$this.isActive', true] } 
            } 
          } 
        } 
      }
    ]).exec();
    
    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const activePlayers = result[0].players || [];
    
    // Guardar en cache por 5 minutos
    cache.set(cacheKey, activePlayers, 300000);
    
    return NextResponse.json(activePlayers);
  } catch (error) {
    console.error('Error fetching group players:', error);
    return NextResponse.json({ error: 'Error fetching group players' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = await params;
    await connectToDatabase();
    
    const { id, name, nickname, avatar } = await request.json();
    
    const group = await Group.findOne({ id: groupId, isActive: true });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    const newPlayer = {
      id: id || Date.now().toString(),
      name,
      nickname: nickname || name,
      avatar: avatar || '👨‍🎓',
      isActive: true
    };
    
    group.players.push(newPlayer);
    await group.save();
    
    // Invalidar cache
    cache.clear();
    
    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    console.error('Error adding player to group:', error);
    return NextResponse.json({ error: 'Error adding player to group' }, { status: 500 });
  }
}

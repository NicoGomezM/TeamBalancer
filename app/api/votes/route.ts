import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Vote, Group } from '@/lib/models';
import { cache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    
    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    // Verificar cache
    const cacheKey = `votes_${groupId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    await connectToDatabase();

    // Obtener todos los votos del grupo
    const votes = await Vote.find({ groupId }).sort({ updatedAt: -1 });
    
    // Guardar en cache por 5 minutos
    cache.set(cacheKey, votes, 300);
    
    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Error fetching votes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { groupId, fromPlayerId, toPlayerId, points } = await request.json();
    
    if (!groupId || !fromPlayerId || !toPlayerId || !points) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (points < 1 || points > 10) {
      return NextResponse.json({ error: 'Points must be between 1 and 10' }, { status: 400 });
    }

    if (fromPlayerId === toPlayerId) {
      return NextResponse.json({ error: 'Cannot vote for yourself' }, { status: 400 });
    }

    await connectToDatabase();

    // Verificar que el grupo existe
    const group = await Group.findOne({ id: groupId, isActive: true });
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Verificar que ambos jugadores existen en el grupo
    const fromPlayer = group.players.find((p: { id: string; isActive: boolean }) => p.id === fromPlayerId && p.isActive);
    const toPlayer = group.players.find((p: { id: string; isActive: boolean }) => p.id === toPlayerId && p.isActive);
    
    if (!fromPlayer || !toPlayer) {
      return NextResponse.json({ error: 'One or both players not found in group' }, { status: 404 });
    }

    // Crear o actualizar el voto
    const voteData = {
      id: `${fromPlayerId}_${toPlayerId}`,
      groupId,
      fromPlayerId,
      toPlayerId,
      points,
      updatedAt: new Date()
    };

    const vote = await Vote.findOneAndUpdate(
      { groupId, fromPlayerId, toPlayerId },
      voteData,
      { upsert: true, new: true }
    );

    // Invalidar cache
    cache.clear();

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    console.error('Error saving vote:', error);
    return NextResponse.json({ error: 'Error saving vote' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const fromPlayerId = searchParams.get('fromPlayerId');
    const toPlayerId = searchParams.get('toPlayerId');
    
    if (!groupId || !fromPlayerId || !toPlayerId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await connectToDatabase();

    await Vote.deleteOne({ groupId, fromPlayerId, toPlayerId });
    
    // Invalidar cache
    cache.clear();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vote:', error);
    return NextResponse.json({ error: 'Error deleting vote' }, { status: 500 });
  }
}

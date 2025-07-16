import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Group, IGroupPlayer } from '@/lib/models';
import { cache } from '@/lib/cache';

export async function PUT(
  request: NextRequest,
  { params }: { params: { groupId: string; playerId: string } }
) {
  try {
    const { groupId, playerId } = await params;
    await connectToDatabase();
    
    const { name, nickname, isActive } = await request.json();
    
    const group = await Group.findOne({ id: groupId, isActive: true });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    const playerIndex = group.players.findIndex((p: IGroupPlayer) => p.id === playerId);
    
    if (playerIndex === -1) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    // Actualizar jugador
    if (name !== undefined) group.players[playerIndex].name = name;
    if (nickname !== undefined) group.players[playerIndex].nickname = nickname;
    if (isActive !== undefined) group.players[playerIndex].isActive = isActive;
    
    await group.save();
    
    // Invalidar cache
    cache.clear();
    
    return NextResponse.json(group.players[playerIndex]);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json({ error: 'Error updating player' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { groupId: string; playerId: string } }
) {
  try {
    const { groupId, playerId } = await params;
    await connectToDatabase();
    
    const group = await Group.findOne({ id: groupId, isActive: true });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    const playerIndex = group.players.findIndex((p: IGroupPlayer) => p.id === playerId);
    
    if (playerIndex === -1) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    // Eliminar jugador
    group.players.splice(playerIndex, 1);
    await group.save();
    
    // Invalidar cache
    cache.clear();
    
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ error: 'Error deleting player' }, { status: 500 });
  }
}

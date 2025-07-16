import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Group } from '@/lib/models';
import { cache } from '@/lib/cache';

export async function GET() {
  try {
    // Verificar cache primero
    const cacheKey = 'groups_active';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    await connectToDatabase();
    
    // Optimizar consulta: solo campos necesarios y con índice
    const groups = await Group.find(
      { isActive: true }, 
      { id: 1, name: 1, icon: 1, color: 1, 'players.id': 1, 'players.name': 1, 'players.nickname': 1, 'players.avatar': 1 }
    )
    .sort({ name: 1 })
    .lean() // Usar lean() para mejor rendimiento
    .exec();
    
    // Guardar en cache por 5 minutos
    cache.set(cacheKey, groups, 300000);
    
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Error fetching groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { id, name, icon, color, players } = await request.json();
    
    const group = new Group({
      id,
      name,
      icon: icon || '🎓',
      color: color || 'bg-blue-500',
      players: players || [],
      isActive: true
    });
    
    await group.save();
    
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Error creating group' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Group } from '@/lib/models'

export async function GET() {
  try {
    await connectToDatabase()
    
    const groups = await Group.find({}).sort({ createdAt: -1 })
    
    const groupsWithStats = groups.map(group => ({
      id: group._id.toString(),
      name: group.name,
      icon: group.icon || '🎓',
      color: group.color || 'bg-blue-500',
      players: group.players.map((player: any) => ({
        id: player.id,
        name: player.name,
        nickname: player.nickname || player.name,
        avatar: player.avatar || '👤',
        isActive: player.isActive !== false
      })),
      isActive: group.isActive !== false,
      createdAt: group.createdAt?.toISOString() || new Date().toISOString(),
      playerCount: group.players.length,
      activePlayerCount: group.players.filter((p: any) => p.isActive !== false).length
    }))
    
    return NextResponse.json(groupsWithStats)
  } catch (error) {
    console.error('Error getting groups:', error)
    return NextResponse.json(
      { error: 'Error al obtener los grupos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { name, icon, color } = await request.json()
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre del grupo es requerido' },
        { status: 400 }
      )
    }
    
    // Verificar que el grupo no exista
    const existingGroup = await Group.findOne({ name: name.trim() })
    if (existingGroup) {
      return NextResponse.json(
        { error: 'Ya existe un grupo con ese nombre' },
        { status: 400 }
      )
    }
    
    const newGroup = new Group({
      name: name.trim(),
      icon: icon || '🎓',
      color: color || 'bg-blue-500',
      players: [],
      isActive: true,
      createdAt: new Date()
    })
    
    await newGroup.save()
    
    return NextResponse.json({
      id: newGroup._id.toString(),
      name: newGroup.name,
      icon: newGroup.icon,
      color: newGroup.color,
      players: [],
      isActive: newGroup.isActive,
      createdAt: newGroup.createdAt.toISOString(),
      playerCount: 0,
      activePlayerCount: 0
    })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Error al crear el grupo' },
      { status: 500 }
    )
  }
}

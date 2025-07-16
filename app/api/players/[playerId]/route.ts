import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Group } from '@/lib/models'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    await connectDB()
    
    const { playerId } = await params
    const { name, nickname, avatar } = await request.json()
    
    console.log('API: Actualizando jugador con ID:', playerId)
    console.log('API: Datos recibidos:', { name, nickname, avatar })
    
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 })
    }

    // Buscar el grupo que contiene al jugador
    const group = await Group.findOne({
      'players.id': playerId
    })

    console.log('API: Grupo encontrado:', group ? group.id : 'NO ENCONTRADO')

    if (!group) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })
    }

    // Encontrar el índice del jugador en el array
    const playerIndex = group.players.findIndex((p: any) => p.id === playerId)
    
    console.log('API: Índice del jugador en el grupo:', playerIndex)
    
    if (playerIndex === -1) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })
    }

    // Actualizar los datos del jugador
    group.players[playerIndex].name = name.trim()
    group.players[playerIndex].nickname = nickname?.trim() || name.trim()
    
    if (avatar) {
      group.players[playerIndex].avatar = avatar
    }

    // Guardar los cambios
    await group.save()

    console.log('API: Jugador actualizado exitosamente')

    return NextResponse.json(group.players[playerIndex])
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

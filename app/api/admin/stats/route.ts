import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Group } from '@/lib/models'

export async function GET() {
  try {
    await connectToDatabase()
    
    const groups = await Group.find({})
    
    const totalGroups = groups.length
    const activeGroups = groups.filter(group => group.isActive !== false).length
    
    let totalPlayers = 0
    let activePlayers = 0
    
    groups.forEach(group => {
      totalPlayers += group.players.length
      activePlayers += group.players.filter((player: any) => player.isActive !== false).length
    })
    
    return NextResponse.json({
      totalGroups,
      activeGroups,
      totalPlayers,
      activePlayers
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas' },
      { status: 500 }
    )
  }
}

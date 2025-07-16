import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Vote } from '@/lib/models'

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    await connectDB()
    
    const { groupId } = params
    
    if (!groupId) {
      return NextResponse.json({ error: 'Group ID es requerido' }, { status: 400 })
    }

    // Eliminar todos los votos del grupo
    await Vote.deleteMany({ groupId })

    return NextResponse.json({ 
      message: 'Puntajes reseteados exitosamente',
      deletedCount: await Vote.countDocuments({ groupId })
    })
  } catch (error) {
    console.error('Error resetting scores:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

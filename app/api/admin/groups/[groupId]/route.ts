import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Group } from '@/lib/models'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    await connectToDatabase()
    
    const { groupId } = await params
    const { isActive } = await request.json()
    
    const group = await Group.findByIdAndUpdate(
      groupId,
      { isActive },
      { new: true }
    )
    
    if (!group) {
      return NextResponse.json(
        { error: 'Grupo no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      id: group._id.toString(),
      name: group.name,
      isActive: group.isActive
    })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el grupo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    await connectToDatabase()
    
    const { groupId } = await params
    
    const group = await Group.findByIdAndDelete(groupId)
    
    if (!group) {
      return NextResponse.json(
        { error: 'Grupo no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Grupo eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el grupo' },
      { status: 500 }
    )
  }
}

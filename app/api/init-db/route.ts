import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Group } from '@/lib/models';

export async function POST() {
  try {
    await connectToDatabase();
    
    // Limpiar grupos existentes
    await Group.deleteMany({});
    
    // Crear grupos ICINF-UBB
    const groups = [
      {
        id: 'ICINF-UBB-G20',
        name: 'ICINF-UBB-G20',
        icon: '🎓',
        color: 'bg-blue-500',
        players: [
          { id: '1', name: 'Jugador 1', nickname: 'J1', avatar: '👨‍🎓', isActive: true },
          { id: '2', name: 'Jugador 2', nickname: 'J2', avatar: '👩‍🎓', isActive: true },
          { id: '3', name: 'Jugador 3', nickname: 'J3', avatar: '👨‍💻', isActive: true },
          { id: '4', name: 'Jugador 4', nickname: 'J4', avatar: '👩‍💻', isActive: true },
          { id: '5', name: 'Jugador 5', nickname: 'J5', avatar: '👨‍🎨', isActive: true },
        ],
        isActive: true
      },
      {
        id: 'ICINF-UBB-G21',
        name: 'ICINF-UBB-G21',
        icon: '🎓',
        color: 'bg-green-500',
        players: [
          { id: '1', name: 'Nacho Peña', nickname: 'Nacho', avatar: '👨‍🎓', isActive: true },
          { id: '2', name: 'Tomás Saez', nickname: 'Tomi', avatar: '👨‍💻', isActive: true },
          { id: '3', name: 'Mauri Guiseppe', nickname: 'Mauri', avatar: '👨‍🎮', isActive: true },
          { id: '4', name: 'Kroz', nickname: 'Kroz', avatar: '👨‍🚀', isActive: true },
          { id: '5', name: 'JoacoPL', nickname: 'Joaco', avatar: '👨‍🎯', isActive: true },
          { id: '6', name: 'Marcoco', nickname: 'Marco', avatar: '👨‍🏀', isActive: true },
          { id: '7', name: 'Nico Gomez', nickname: 'Nico', avatar: '👨‍💼', isActive: true },
          { id: '8', name: 'Amigo Tomi', nickname: 'Tomi', avatar: '👨‍🤝', isActive: true },
          { id: '9', name: 'Manu', nickname: 'Manu', avatar: '👨‍🎨', isActive: true },
          { id: '10', name: 'Felipe Guerra', nickname: 'Felipe', avatar: '👨‍⚔️', isActive: true },
          { id: '11', name: 'Bastián Rodriguez', nickname: 'Bastián', avatar: '👨‍🔧', isActive: true },
          { id: '12', name: 'Luis Pereira', nickname: 'Luis', avatar: '👨‍🏫', isActive: true },
          { id: '13', name: 'Estebanzzz', nickname: 'Esteban', avatar: '👨‍🎵', isActive: true },
          { id: '14', name: 'Joaqo', nickname: 'Joaqo', avatar: '👨‍🎪', isActive: true },
        ],
        isActive: true
      },
      {
        id: 'ICINF-UBB-G22',
        name: 'ICINF-UBB-G22',
        icon: '🎓',
        color: 'bg-purple-500',
        players: [
          { id: '1', name: 'Estudiante 1', nickname: 'Est1', avatar: '👨‍🎓', isActive: true },
          { id: '2', name: 'Estudiante 2', nickname: 'Est2', avatar: '👩‍🎓', isActive: true },
          { id: '3', name: 'Estudiante 3', nickname: 'Est3', avatar: '👨‍💻', isActive: true },
          { id: '4', name: 'Estudiante 4', nickname: 'Est4', avatar: '👩‍💻', isActive: true },
          { id: '5', name: 'Estudiante 5', nickname: 'Est5', avatar: '👨‍🎨', isActive: true },
        ],
        isActive: true
      },
      {
        id: 'ICINF-UBB-G23',
        name: 'ICINF-UBB-G23',
        icon: '🎓',
        color: 'bg-orange-500',
        players: [
          { id: '1', name: 'Compañero 1', nickname: 'Comp1', avatar: '👨‍🎓', isActive: true },
          { id: '2', name: 'Compañero 2', nickname: 'Comp2', avatar: '👩‍🎓', isActive: true },
          { id: '3', name: 'Compañero 3', nickname: 'Comp3', avatar: '👨‍💻', isActive: true },
          { id: '4', name: 'Compañero 4', nickname: 'Comp4', avatar: '👩‍💻', isActive: true },
          { id: '5', name: 'Compañero 5', nickname: 'Comp5', avatar: '👨‍🎨', isActive: true },
        ],
        isActive: true
      },
      {
        id: 'ICINF-UBB-G24',
        name: 'ICINF-UBB-G24',
        icon: '🎓',
        color: 'bg-red-500',
        players: [
          { id: '1', name: 'Miembro 1', nickname: 'Miem1', avatar: '👨‍🎓', isActive: true },
          { id: '2', name: 'Miembro 2', nickname: 'Miem2', avatar: '👩‍🎓', isActive: true },
          { id: '3', name: 'Miembro 3', nickname: 'Miem3', avatar: '👨‍💻', isActive: true },
          { id: '4', name: 'Miembro 4', nickname: 'Miem4', avatar: '👩‍💻', isActive: true },
          { id: '5', name: 'Miembro 5', nickname: 'Miem5', avatar: '👨‍🎨', isActive: true },
        ],
        isActive: true
      },
      {
        id: 'ICINF-UBB-G25',
        name: 'ICINF-UBB-G25',
        icon: '🎓',
        color: 'bg-yellow-500',
        players: [
          { id: '1', name: 'Participante 1', nickname: 'Part1', avatar: '👨‍🎓', isActive: true },
          { id: '2', name: 'Participante 2', nickname: 'Part2', avatar: '👩‍🎓', isActive: true },
          { id: '3', name: 'Participante 3', nickname: 'Part3', avatar: '👨‍💻', isActive: true },
          { id: '4', name: 'Participante 4', nickname: 'Part4', avatar: '👩‍💻', isActive: true },
          { id: '5', name: 'Participante 5', nickname: 'Part5', avatar: '👨‍🎨', isActive: true },
        ],
        isActive: true
      }
    ];
    
    // Insertar todos los grupos
    await Group.insertMany(groups);
    
    return NextResponse.json({ message: 'Database initialized successfully', groups: groups.length });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Error initializing database' }, { status: 500 });
  }
}

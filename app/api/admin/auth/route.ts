import { NextRequest, NextResponse } from 'next/server'

// Contraseña de administrador (en producción debería estar en variables de entorno)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()

        if (password === ADMIN_PASSWORD) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json(
                { error: 'Contraseña incorrecta' },
                { status: 401 }
            )
        }
    } catch (error) {
        console.error('Error in admin auth:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamBalance } from '@/lib/models';

export async function POST(request: NextRequest) {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        await connectDB();
        console.log('✅ Connected to MongoDB successfully');

        const data = await request.json();
        console.log('📥 Received data:', JSON.stringify(data, null, 2));

        const { sessionId, players, teams } = data;

        if (!sessionId) {
            return NextResponse.json(
                { success: false, message: 'Session ID is required' },
                { status: 400 }
            );
        }

        // Buscar si ya existe una sesión con este ID
        let teamBalance = await TeamBalance.findOne({ sessionId });
        console.log('🔍 Existing session found:', !!teamBalance);

        if (teamBalance) {
            // Actualizar la sesión existente
            teamBalance.players = players;
            teamBalance.teams = teams;
            teamBalance.updatedAt = new Date();
            await teamBalance.save();
            console.log('✅ Session updated successfully');
        } else {
            // Crear nueva sesión
            teamBalance = new TeamBalance({
                sessionId,
                players,
                teams
            });
            await teamBalance.save();
            console.log('✅ New session created successfully');
        }

        return NextResponse.json({
            success: true,
            message: 'Team balance saved successfully',
            data: teamBalance
        });

    } catch (error) {
        console.error('❌ Error saving team balance:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error saving team balance',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        console.log('🔄 Attempting to connect to MongoDB for GET request...');
        await connectDB();
        console.log('✅ Connected to MongoDB successfully');

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');
        console.log('🔍 Looking for session:', sessionId);

        if (!sessionId) {
            return NextResponse.json(
                { success: false, message: 'Session ID is required' },
                { status: 400 }
            );
        }

        const teamBalance = await TeamBalance.findOne({ sessionId });
        console.log('📊 Team balance found:', !!teamBalance);

        if (!teamBalance) {
            return NextResponse.json(
                { success: false, message: 'Team balance not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: teamBalance
        });

    } catch (error) {
        console.error('❌ Error fetching team balance:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error fetching team balance',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

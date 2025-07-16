import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📝 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await connectToDatabase();
    
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    console.log('🔌 Connection state:', connectionStates[connectionState as keyof typeof connectionStates]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      connectionState: connectionStates[connectionState as keyof typeof connectionStates],
      database: mongoose.connection.name
    });

  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

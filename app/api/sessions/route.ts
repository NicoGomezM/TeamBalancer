import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TeamBalance } from '@/lib/models';

export async function GET() {
  try {
    console.log('🔄 Attempting to connect to MongoDB for sessions...');
    await connectDB();
    console.log('✅ Connected to MongoDB successfully');
    
    const sessions = await TeamBalance.find({})
      .select('sessionId createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    console.log('📊 Found sessions:', sessions.length);

    return NextResponse.json({ 
      success: true, 
      data: sessions 
    });

  } catch (error) {
    console.error('❌ Error fetching sessions:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching sessions',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

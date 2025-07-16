const { connectToDatabase } = require('./lib/mongodb.ts');

async function testConnection() {
  try {
    await connectToDatabase();
    console.log('✅ Connection test successful');
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();

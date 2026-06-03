const mongoose = require('mongoose');

let mongoMemoryServer = null;
let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  const startInMemoryDB = async (reason) => {
    try {
      console.log('\n======================================================');
      console.log(`NOTICE: ${reason}`);
      console.log('Starting a temporary in-memory MongoDB database...');
      console.log('Note: Data will NOT be persistent and will reset when the server restarts.');
      console.log('======================================================\n');

      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        binary: {
          version: '4.4.26' // Highly compatible, much smaller download (~70MB) than MongoDB 8.x (~780MB)
        }
      });
      const inMemoryUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(inMemoryUri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
      isConnected = true;
      return true;
    } catch (err) {
      console.error('Failed to start in-memory MongoDB database:', err.message);
      isConnected = false;
      return false;
    }
  };

  if (!uri) {
    return await startInMemoryDB('MONGODB_URI is not defined in server/.env.');
  }

  if (uri.includes('<db_password>')) {
    return await startInMemoryDB('MONGODB_URI contains the placeholder "<db_password>".');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    return await startInMemoryDB('Could not connect to your primary database.');
  }
};

const getDbStatus = () => isConnected;

// Clean up database connection on shutdown
process.on('SIGINT', async () => {
  if (mongoMemoryServer) {
    await mongoose.disconnect();
    await mongoMemoryServer.stop();
    console.log('In-memory database stopped.');
  }
  process.exit(0);
});

module.exports = { connectDB, getDbStatus };

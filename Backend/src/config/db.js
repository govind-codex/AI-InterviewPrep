const mongoose = require('mongoose');

let connectionPromise;

async function connectDB() {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('Missing MONGO_URI or MONGODB_URI environment variable');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    const timeout = Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 10000;

    connectionPromise = mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: timeout,
        connectTimeoutMS: timeout
    });

    try {
        await connectionPromise;
        console.log('Connected to MongoDB');
        return mongoose.connection;
    } catch (error) {
        connectionPromise = undefined;
        throw error;
    }
}

module.exports = connectDB;

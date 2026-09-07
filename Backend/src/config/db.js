const mongoose = require('mongoose');


async function connectDB() {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('Missing MONGO_URI or MONGODB_URI environment variable');
    }

    const timeout = Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 10000;

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: timeout,
        connectTimeoutMS: timeout
    });

    console.log('Connected to MongoDB');
}

module.exports = connectDB;

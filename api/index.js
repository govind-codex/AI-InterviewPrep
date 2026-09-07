const app = require('../Backend/src/app');
const connectDB = require('../Backend/src/config/db');

let connectionPromise;

async function handler(req, res) {
  try {
    if (!connectionPromise) {
      connectionPromise = connectDB().catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
    }

    await connectionPromise;
    return app(req, res);
  } catch (error) {
    console.error('Unable to initialize the API:', error);
    return res.status(503).json({
      message: 'The API is temporarily unavailable. Please try again shortly.',
    });
  }
}

module.exports = handler;

require('dotenv').config();
const dns = require("dns");
const app = require('./src/app');
const connectDB = require('./src/config/db');


dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function logDatabaseError(error, retryDelay) {
  if (error?.name === 'MongooseServerSelectionError') {
    console.error(
      `MongoDB Atlas is unreachable. Verify that the cluster is active and add this machine's current public IP in Atlas Network Access. Retrying in ${retryDelay / 1000}s...`
    );
    return;
  }

  console.error(`MongoDB connection failed: ${error?.message || 'Unknown error'}. Retrying in ${retryDelay / 1000}s...`);
}

async function startServer() {
  const retryDelay = Number(process.env.MONGO_RETRY_DELAY_MS) || 10000;

  while (true) {
    try {
      await connectDB();
      break;
    } catch (error) {
      logDatabaseError(error, retryDelay);
      await wait(retryDelay);
    }
  }

  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error(`Failed to start server: ${error?.message || error}`);
  process.exit(1);
});

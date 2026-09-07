const express = require('express');
const cookieParser = require("cookie-parser")
const authRouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.Routes');
const cors = require('cors');



const app = express();
const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

function isAllowedOrigin(origin, requestHost) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = origin.replace(/\/$/, '');

  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  try {
    const url = new URL(origin);
    const parsedOrigin = url.origin.replace(/\/$/, '');
    return url.host === requestHost || allowedOrigins.includes(parsedOrigin);
  } catch (error) {
    return false;
  }
}

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use((req, res, next) => cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin, req.get('host'))) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  })(req, res, next));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'AI Resume backend is running',
    health: 'ok',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ health: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ health: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Resume PDF must be smaller than 4 MB' });
  }

  return res.status(error?.status || 500).json({
    message: error?.status && error.status < 500
      ? error.message
      : 'An unexpected server error occurred',
  });
});


module.exports = app;

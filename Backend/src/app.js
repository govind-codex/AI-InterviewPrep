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

function isAllowedOrigin(origin) {
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
    return (
      /^https:\/\/.*\.vercel\.app$/.test(parsedOrigin) ||
      /^https:\/\/.*\.netlify\.app$/.test(parsedOrigin)
    );
  } catch (error) {
    return false;
  }
}

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
}));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'AI Resume backend is running',
    health: 'ok',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ health: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);


module.exports = app;

# Deploying to Vercel

The repository is configured as one Vercel project. Vercel builds the React app
from `Frontend/` and deploys the Express API as a Node.js Function from
`api/index.js`. Browser requests use the same deployment origin under `/api`, so
`VITE_API_BASE_URL` is not needed for the normal setup.

## 1. Prepare MongoDB Atlas

- Use a persistent Atlas cluster; local MongoDB is not reachable from Vercel.
- Allow connections from Vercel. Because serverless outbound IP addresses can
  change, the simplest Atlas setting is `0.0.0.0/0` with a strong database user
  and password. For stricter networking, use a Vercel plan/networking option
  with fixed egress and allow only those addresses.
- Copy the Atlas connection string, including the database name.

## 2. Import the repository

1. Import the Git repository in Vercel.
2. Keep **Root Directory** at the repository root. Do not select `Frontend` or
   `Backend`.
3. Vercel reads the checked-in `vercel.json`; no build-setting overrides are
   required.

## 3. Add environment variables

In **Project Settings > Environment Variables**, add these to Production and
Preview as appropriate:

| Name | Required | Value |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | A long, random signing secret |
| `GOOGLE_GENAI_API_KEY` | Yes | Google Gemini API key |
| `FRONTEND_URL` | No | Only needed when the frontend is hosted on another origin |
| `MONGO_CONNECT_TIMEOUT_MS` | No | MongoDB connection timeout; defaults to `10000` |

Do not add `PORT`; Vercel manages the function listener. Do not prefix backend
secrets with `VITE_`, because Vite exposes those variables to the browser.

## 4. Deploy and verify

Deploy from the Vercel dashboard, or run:

```bash
npx vercel
npx vercel --prod
```

After deployment:

1. Open `/api/health` and confirm it returns `{"health":"ok"}`.
2. Register a test account.
3. Upload a PDF smaller than 4 MB and generate a report.
4. Open a client-side route such as `/login` directly and confirm the SPA loads.

If `/api/health` returns `503`, inspect the Function logs and verify `MONGO_URI`
and Atlas Network Access. AI report generation is configured with a five-minute
function duration to accommodate PDF parsing and the Gemini request.

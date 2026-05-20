# Roast My Profile

Roast My Profile is a frontend-first Next.js MVP that lets users paste a social bio, choose a platform and tone, then generate a playful roast, a better bio, quick tips, a share caption, and a downloadable PNG result card.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- FastRouter OpenAI-compatible chat completions API
- Serverless API route at `POST /api/generate-roast`
- `html-to-image` for PNG export

## Local setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```powershell
New-Item -ItemType File -Path src/app/.env -Force
```

Add your server-only OpenAI key:

```bash
FASTROUTER_API_URL=https://go.fastrouter.ai/api/v1/chat/completions
FASTROUTER_MODEL=your-model-name
FASTROUTER_API_KEY=your-real-key
```

Local development is intentionally configured to read `src/app/.env`. Next.js does not load that path by default; the API route loads it server-side before calling the AI provider.

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

`FASTROUTER_API_URL`, `FASTROUTER_MODEL`, and `FASTROUTER_API_KEY` are required by the backend route. For this project, put them in `src/app/.env` for local development.

Do not put API keys in frontend code. Do not name them with a `NEXT_PUBLIC_` prefix. Any variable prefixed with `NEXT_PUBLIC_` can be exposed to the browser bundle.

For deployment, set these variables as server-side environment variables in your hosting provider unless you have a secure deployment process that provisions `src/app/.env` on the server. On Vercel, add them under Project Settings -> Environment Variables for Production, Preview, and Development as needed.

## API route

Endpoint:

```http
POST /api/generate-roast
```

Request body:

```json
{
  "profileText": "Computer science student passionate about web development, teamwork, and learning new technologies through hands-on projects.",
  "platform": "LinkedIn",
  "tone": "Light roast"
}
```

Success response:

```json
{
  "roast": "string",
  "betterBio": "string",
  "tips": ["string", "string", "string"],
  "shareCaption": "string"
}
```

PowerShell test:

```powershell
curl.exe -X POST http://localhost:3000/api/generate-roast `
  -H "Content-Type: application/json" `
  -d "{\"profileText\":\"Computer science student passionate about web development, teamwork, and learning new technologies through hands-on projects.\",\"platform\":\"LinkedIn\",\"tone\":\"Light roast\"}"
```

The route validates:

- Missing or invalid JSON
- Missing `profileText`, `platform`, or `tone`
- Profile text under 20 characters
- Profile text over 800 characters
- Unknown platform values
- Unknown tone values
- Invalid model output shape

If OpenAI fails, the API returns a friendly error message without exposing internal details.

## Production checks

```bash
npm run lint
npm run build
```

Optional secret exposure check after build:

```bash
rg "FASTROUTER_API_KEY|OPENAI_API_KEY|NEXT_PUBLIC_|sk-[A-Za-z0-9_-]{20,}" .next/static src/App.tsx src/components src/lib
```

API keys should appear only in server-side route code, `src/app/.env`, and docs. They should never appear in browser bundles or client-side source.

## Deploy

Deploy as a standard Next.js app. For Vercel:

1. Import the repository.
2. Set `FASTROUTER_API_URL`, `FASTROUTER_MODEL`, and `FASTROUTER_API_KEY` in Project Settings -> Environment Variables.
3. Deploy.

No login, payment system, or database is required for the MVP.

# Our Little Love Story ❤️

A romantic, mobile-friendly Next.js love quiz for Sangeeta. The special date is checked on the server; the answer key for quiz questions is also kept on the server.

## Requirements
- Node.js 20.9 or newer
- npm
- A Vercel account for deployment

## 1. Install and configure

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and set:

```env
LOVE_DATE_SECRET=01112025
SESSION_SECRET=PASTE_A_RANDOM_SECRET_HERE
```

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated output into `SESSION_SECRET`. Do not use a `NEXT_PUBLIC_` prefix for secrets. Never commit `.env.local` to Git.

## 2. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

To make a production build locally:

```bash
npm run build
npm start
```

## 3. Personalize the questions

Edit `lib/questions.js`. Each question has:
- `id`: unique identifier
- `question`: the question text
- `options`: choices shown to Sangeeta
- `answer`: the correct answer (server-only; do not move this data to a client component)

For example, replace the generic questions with real memories such as where you first met, your first trip, her favourite dessert, or a special moment. Keep the correct answer exactly matching one of the options. The code normalizes case and whitespace.

The starter pack uses the special date 1 November 2025 in two demo questions. If that date is not your wedding date, update those questions. The unlock date itself is controlled by `LOVE_DATE_SECRET`.

Change the reveal message in `app/page.js` by editing `LOVE_MESSAGE`.

## 4. Deploy to Vercel

### Recommended: GitHub import
1. Create a new GitHub repository.
2. Add the project files to the repository. Do not upload `.env.local`.
3. Open https://vercel.com/new and import the repository.
4. Vercel should detect Next.js automatically. Keep the default build settings.
5. In the project settings, open **Environment Variables** and add:
   - `LOVE_DATE_SECRET` = `01112025` (or your preferred DDMMYYYY date)
   - `SESSION_SECRET` = the random 64-character hex value generated above
6. Apply these variables to Production (and Preview if you want to test preview deploys).
7. Deploy, then open the assigned `.vercel.app` URL.

If you add/change environment variables after deploying, redeploy so the new values are available.

### Alternative: Vercel CLI
Install the CLI and log in:

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts to link the project. Add the two environment variables in the Vercel dashboard, then deploy to production:

```bash
vercel --prod
```

## Security notes
- The special date and correct quiz answers are validated on the server and are not shipped as answer keys to the browser.
- The session uses a signed, HttpOnly cookie that expires after 12 hours.
- This is a sweet surprise, not high-security authentication. A date is guessable, and this starter does not implement durable rate limiting. If you need stronger protection, use a long random passphrase and add rate limiting (for example with Upstash Redis) to the unlock and answer endpoints.
- Keep `SESSION_SECRET` private and use a different random value in production.
- Do not store private credentials in client-side code or variables prefixed with `NEXT_PUBLIC_`.

## Fixed question
The app always displays one fixed question: “हमारी शादी किस महीने में हुई थी? 💍” with the answer “नवंबर”. Edit `lib/questions.js` if you want a different fixed question. The answer is validated on the server and is not sent to the browser.

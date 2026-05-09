# EduAssist Frontend

EduAssist is a Next.js frontend for helping teachers turn uploaded PDF materials into generated assessments. The app supports account access, PDF material upload, quiz generation, question review/refinement, test library browsing, and PDF export.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- ESLint 9 with the Next.js config
- jsPDF for client-side PDF export

## Features

- Landing page for EduAssist AI
- Login, signup, forgot-password, and reset-password screens
- Authenticated frontend requests after login
- PDF-only material upload and browser preview
- Quiz generation from uploaded materials
- Question review with edit, keep, and refine actions
- Generated test library with search, status filtering, and sorting
- Downloadable PDF export with questions and an answer key

## Project Structure

```text
src/
  app/
    app/              Main quiz generation workflow
    forgot-password/  Password reset request page
    login/            Login page
    my-tests/         Generated test library
    reset-password/   New password form
    settings/         Settings page
    signup/           Signup page
    page.js           Landing page route
  components/         Shared UI panels and landing/auth components
  data/               Local placeholder data
  lib/
    api.js            Backend API client and token helpers
public/               Static assets
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file if the backend is not running at the default URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Builds the production app.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## Backend Configuration

The frontend API client is in `src/lib/api.js`. It reads `NEXT_PUBLIC_API_BASE_URL` and defaults to:

```text
http://localhost:8080
```

Expected backend routes include:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /me`
- `POST /materials`
- `POST /materials/upload`
- `GET /materials`
- `GET /materials/:id`
- `DELETE /materials/:id`
- `POST /materials/:id/generate-quiz`
- `POST /materials/questions/:questionId/refine`
- `POST /quiz/refine`
- `POST /quizzes`
- `POST /quizzes/:id/export`
- `GET /quizzes`
- `GET /quizzes/:id`
- `DELETE /quizzes/:id`
- `GET /health`

Authenticated requests include the signed-in user's bearer token automatically.

## Main Workflow

1. Create an account or log in.
2. Upload one or more PDF materials from the generator page.
3. Enter a test title, question count, question types, and difficulty mix.
4. Generate questions from the selected material.
5. Review, edit, refine, and keep the questions you want.
6. Download the kept questions as a PDF with an answer key.

## Notes

- Uploaded files are currently limited in the UI to PDFs.
- Client-side PDF export is handled by `jsPDF`.
- The `/my-tests` page depends on the backend returning saved quizzes from `GET /quizzes`.
- The `/app` page stores generated questions in local component state after generation.
- Do not commit real secrets or private environment values. Keep local-only values in `.env.local`.

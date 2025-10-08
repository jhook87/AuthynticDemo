# Setup & Deployment Guide

## Prerequisites

- Node.js 18 or newer
- npm 9+
- Optional: Docker for containerized execution

## Local Development

```bash
npm install
npm run dev
```

This launches Vite at `http://localhost:5173`. Hot module replacement is enabled.

## Production Build

```bash
npm run build
```

The `dist/` folder contains static assets ready for hosting on Netlify, Vercel, or S3 + CloudFront. A service worker (`public/service-worker.js`) is included to enable offline caching of the application shell and media assets.

## Docker

A minimal `Dockerfile` is included at the repository root. Build and run with:

```bash
docker build -t authyntic-demo .
docker run -p 4173:4173 authyntic-demo
```

The container executes `npm run build` and serves the output with `vite preview`.

## Environment Variables

No backend integration is required for the demo. If you integrate external services (webhooks, analytics), add your environment variables to `.env.local` and reference them via `import.meta.env`.

## Continuous Integration

GitHub Actions workflows (`.github/workflows/ci.yml`) execute linting (if configured), build, and tests on each push. Customize the workflow for additional security gates or deployment steps.

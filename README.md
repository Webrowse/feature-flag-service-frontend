# Feature Flag Service - Frontend

React SPA for managing feature flags across projects and environments. Supports JWT-authenticated access, per-environment flag toggling, and rule-based targeting.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Icons:** Lucide React
- **Server:** Caddy (production, handles SPA fallback)
- **Container:** Docker (multi-stage build)

## Features

- Projects - create and delete projects
- Environments - multiple environments per project (e.g. production, staging)
- Flags - boolean feature flags scoped to an environment
- Rules - targeting rules per flag for fine-grained rollout control
- Auth - JWT login/register with protected routes

## Project Structure

```
src/
  api/          - typed fetch wrappers (auth, flags, projects, environments, rules)
  components/   - shared components (Navbar, ProtectedRoute, shadcn/ui primitives)
  context/      - AuthContext, token storage and session management
  pages/        - route-level page components
  lib/          - utility functions
```

## Getting Started

**Prerequisites:** Node.js 20+, and a running instance of the backend API (defaults to `http://localhost:8080`).

```bash
cp .env.example .env   # set VITE_API_URL if your backend is not on :8080
npm install
npm run dev            # starts at http://localhost:5173
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Base URL of the backend API |

> Vite inlines env vars into the bundle at build time, so `VITE_API_URL` must be set before building, not at runtime.

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Docker

Two-stage build: Node compiles the Vite bundle, Caddy serves it with SPA fallback routing.

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  -t feature-flag-frontend .

docker run -p 3000:3000 feature-flag-frontend
```

## Deployment

The repo ships a `Dockerfile` and `nixpacks.toml`. Railway picks up the Dockerfile automatically. Set `VITE_API_URL` as a build variable in the Railway dashboard before deploying.

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page, redirects to dashboard when authenticated |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/dashboard` | Auth required | Projects list |
| `/projects/:projectId` | Auth required | Environments for a project |
| `/projects/:projectId/environments/:envId` | Auth required | Flags for an environment |
| `/projects/:projectId/environments/:envId/flags/:flagId` | Auth required | Rules for a flag |

## API Client

All requests go through `src/api/client.ts`. It reads `VITE_API_URL` at startup, attaches `Authorization: Bearer <token>` from localStorage on authenticated requests, and throws on non-2xx responses with the server error message.

## Related

- **Backend API**: [feature-flag-service-backend](https://github.com/Webrowse/feature-flag-service-backend)

## Linting

```bash
npm run lint
```

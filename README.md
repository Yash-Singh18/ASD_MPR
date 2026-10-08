# QuickDrop

A fake quick-delivery grocery platform (Zepto-style) built for the Agile Software & DevOps mini project. Everything is fake: products are generated, payment is simulated and nothing is delivered.

**Stack:** React (Vite) · FastAPI · PostgreSQL · Docker · GitHub Actions · Jenkins · Prometheus · Grafana
**Process:** SCRUM, tracked in Jira (backlog in `docs/jira_backlog.csv`, plan in `docs/SCRUM.md`)

## Features
- Browse and search products, filter by category
- Cart, fake checkout, order tracking with a 10 minute ETA
- Admin screen: CRUD for products and categories
- Full CRUD REST API (`/docs` for Swagger)
- `/metrics` endpoint, Prometheus scraping and a Grafana dashboard

## Run everything
Requires Docker with the Compose plugin.

```bash
cp .env.example .env            # optional, defaults work
docker compose up -d --build    # db, backend, frontend, prometheus, grafana
```

| Service | URL | Login |
|---|---|---|
| Storefront | http://localhost:3000 | |
| API docs | http://localhost:8000/docs | |
| Prometheus | http://localhost:9090 | |
| Grafana | http://localhost:3001 | admin / admin |

Grafana opens with the **QuickDrop API** dashboard already provisioned (request rate, p95 latency, errors).

## Jenkins (CD)
```bash
docker compose --profile cicd up -d --build jenkins
```
Open http://localhost:8080 (admin / admin). The `quickdrop-deploy` job is created automatically. It checks out the `release` branch and runs the `Jenkinsfile`: test, build, deploy with compose, smoke test.

## GitHub Actions (CI)
- `.github/workflows/ci.yml`: on every push and PR it runs backend tests, builds the frontend and builds the Docker images.
- `.github/workflows/release.yml`: on push to the `release` branch it re-tests and publishes `ghcr.io/<owner>/quickdrop-backend` and `quickdrop-frontend` images.

Release flow: merge `main` into `release` and push.

## Local development
```bash
# backend
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/pytest                         # tests (SQLite)
.venv/bin/uvicorn app.main:app --reload  # uses SQLite unless DATABASE_URL is set

# frontend (proxies /api to localhost:8000)
cd frontend && npm install && npm run dev
```

## Layout
```
backend/      FastAPI app, tests, Dockerfile
frontend/     React app, nginx config, Dockerfile
monitoring/   Prometheus config, Grafana provisioning and dashboard
jenkins/      Jenkins image and Configuration-as-Code
docs/         Jira backlog CSV, SCRUM plan, original project brief
```

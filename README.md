# 2 better than 1

App para parejas/familias. Monorepo con backend (FastAPI) y frontend (Next.js).

## Estructura

```
.
├── backend/    # API FastAPI + PostgreSQL (async, SQLAlchemy, Alembic)
└── frontend/   # Next.js
```

## Puesta en marcha

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # rellena DATABASE_URL
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # ajusta NEXT_PUBLIC_API_URL
npm run dev
```

## Variables de entorno

Los archivos `.env` / `.env.local` **no se versionan** (contienen secretos).
Usa los `.env.example` como plantilla.

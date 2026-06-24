"""FastAPI entrypoint. Registra los routers CRUD de cada módulo."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import agenda, todos
from app.core.config import settings

app = FastAPI(title=settings.app_name)

# CORS: el frontend Next.js corre en localhost:3000 (dev) y le pega a esta API
# en otro puerto. Sin esto, el navegador bloquea las requests cross-origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    # Permite acceder desde el móvil vía la IP LAN de la PC (http://192.168.x.x:3000,
    # 10.x, 172.16-31.x). El navegador del móvil manda ese Origin, no localhost.
    allow_origin_regex=r"http://(192\.168|10|172\.(1[6-9]|2\d|3[01]))(\.\d{1,3}){2}:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)
app.include_router(agenda.router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}

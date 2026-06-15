from fastapi import FastAPI

from app.routers.auth_estudiantes import (
    router as auth_estudiantes_router

)
from app.routers.catalogos import (
    router as catalogos_router
)

from app.routers.auth_profesor import (
    router as auth_profesor_router
)

from app.routers.preguntas import router as preguntas_router

from app.routers.videos import (
    router as videos_router
)

app.include_router(
    videos_router
)

app.include_router(
    preguntas_router
)

app = FastAPI()

app.include_router(
    auth_estudiantes_router
)

app.include_router(
    catalogos_router
)

app.include_router(
    auth_profesor_router
)
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

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

from app.routers.quiz import (
    router as quiz_router
)

from app.routers.resultados import (
    router as resultados_router
)

from app.routers.auth_admin import (

    router as auth_admin_router

)

from app.routers.admin import(
    
    router as admin_router
)

from app.routers.dashboard_estudiante import router as dashboard_estudiante_router

from app.routers.progreso_estudiante import router as progreso_estudiante_router

from app.routers.dashboard_profesor import router as dashboardProfesorRouter

from app.routers.estudiantes_profesor import router as estudiantes_profesor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:4200"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

app.include_router(
    auth_estudiantes_router
)

app.include_router(
    catalogos_router
)

app.include_router(
    auth_profesor_router
)

app.include_router(
    preguntas_router
)

app.include_router(
    videos_router
)

app.include_router(
    quiz_router
)

app.include_router(
    resultados_router
)

app.include_router(

    dashboard_estudiante_router

)

app.include_router(

    progreso_estudiante_router

)

app.include_router(

    dashboardProfesorRouter

)

app.include_router(

    estudiantes_profesor

)

app.include_router(

    auth_admin_router

)

app.include_router(
    admin_router
)
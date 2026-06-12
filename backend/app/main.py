from fastapi import FastAPI

from app.routers.auth_estudiantes import (
    router as auth_estudiantes_router
)
from app.routers.catalogos import (
    router as catalogos_router
)



app = FastAPI()

app.include_router(
    auth_estudiantes_router
)

app.include_router(
    catalogos_router
)
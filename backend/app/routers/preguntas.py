from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)

from sqlalchemy.orm import Session

import pandas as pd

from app.database.database import get_db

from app.models.usuarios import Profesor

from app.models.academico import (
    Competencia,
    Tema,
    Submodulo
)

from app.models.evaluaciones import (
    PreguntaCompetencia
)

from app.schemas.preguntas import (
    ImportacionResponse,
    PreguntaOut
)

from app.core.auth import (
    get_current_profesor
)

from app.services.preguntas_service import (
    obtener_preguntas_profesor,
    buscar_preguntas_profesor,
    obtener_pregunta_profesor
)

router = APIRouter(
    prefix="/preguntas",
    tags=["Preguntas"]
)
from app.services.excel_service import (
    leer_excel_preguntas,
    respuesta_valida
)


# ==========================================
# IMPORTAR EXCEL
# ==========================================

@router.post(
    "/importar-excel",
    response_model=ImportacionResponse
)
def importar_excel(
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    archivo: UploadFile = File(...),
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    competencia = (
        db.query(Competencia)
        .filter(
            Competencia.id_competencia ==
            id_competencia
        )
        .first()
    )

    if not competencia:
        raise HTTPException(
            status_code=404,
            detail="Competencia no encontrada"
        )

    tema = (
        db.query(Tema)
        .filter(
            Tema.id_tema ==
            id_tema
        )
        .first()
    )

    if not tema:
        raise HTTPException(
            status_code=404,
            detail="Tema no encontrado"
        )
    if tema.id_nivel != profesor.id_nivel:

        raise HTTPException(
            status_code=400,
            detail="El tema seleccionado no pertenece al nivel del profesor"
        )

    submodulo = (
        db.query(Submodulo)
        .filter(
            Submodulo.id_submodulo ==
            id_submodulo
        )
        .first()
    )

    if not submodulo:
        raise HTTPException(
            status_code=404,
            detail="Submódulo no encontrado"
        )

    if not archivo.filename.endswith(".xlsx"):
        raise HTTPException(
            status_code=400,
            detail="Solo se permiten archivos .xlsx"
        )

    try:

        df = leer_excel_preguntas(
            archivo
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Error al leer el archivo Excel"
        )

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="El archivo está vacío"
        )

    columnas_requeridas = [
        "Pregunta",
        "Opcion_A",
        "Opcion_B",
        "Opcion_C",
        "Opcion_D",
        "Respuesta_Correcta",
        "Dificultad",
        "Justificacion",
        "Tiempo_Estimado"
    ]

    for columna in columnas_requeridas:

        if columna not in df.columns:

            raise HTTPException(
                status_code=400,
                detail=f"Falta la columna: {columna}"
            )

    importadas = 0

    rechazadas = 0

    for _, row in df.iterrows():

        respuesta = str(
            row["Respuesta_Correcta"]
        ).strip().upper()

        if not respuesta_valida(
            respuesta
        ):

            rechazadas += 1

            continue

        try:

            pregunta = PreguntaCompetencia(

                id_profesor=profesor.id_profesor,

                id_nivel=profesor.id_nivel,

                id_competencia=id_competencia,

                id_tema=id_tema,

                id_submodulo=id_submodulo,

                dificultad=str(
                    row["Dificultad"]
                ),

                pregunta=str(
                    row["Pregunta"]
                ),

                opcion_a=str(
                    row["Opcion_A"]
                ),

                opcion_b=str(
                    row["Opcion_B"]
                ),

                opcion_c=str(
                    row["Opcion_C"]
                ),

                opcion_d=str(
                    row["Opcion_D"]
                ),

                respuesta_correcta=respuesta,

                justificacion=str(
                    row["Justificacion"]
                ),

                tiempo_estimado=int(
                    row["Tiempo_Estimado"]
                ),

                estado=True
            )

            db.add(
                pregunta
            )

            importadas += 1

        except Exception:

            rechazadas += 1

            continue

    db.commit()

    return {
        "preguntas_importadas": importadas,
        "preguntas_rechazadas": rechazadas,
        "mensaje": "Importación completada correctamente"
    }

# ==========================================
# OBTENER PREGUNTAS
# ==========================================

@router.get(
    "/mis-preguntas",
    response_model=list[PreguntaOut]
)
def mis_preguntas(
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    return obtener_preguntas_profesor(
        profesor.id_profesor,
        db
    )


# ==========================================
# BUSCAR PREGUNTAS
# ==========================================

@router.get(
    "/buscar",
    response_model=list[PreguntaOut]
)
def buscar_preguntas(
    id_competencia: int,
    id_submodulo: int,
    id_tema: int,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    return buscar_preguntas_profesor(
        profesor.id_profesor,
        id_competencia,
        id_submodulo,
        id_tema,
        db
    )
    
# ==========================================
# OBTENER PREGUNTA
# ==========================================

@router.get(
    "/{id_pregunta}",
    response_model=PreguntaOut
)
def obtener_pregunta(
    id_pregunta: int,
    profesor: Profesor = Depends(
        get_current_profesor
    ),
    db: Session = Depends(get_db)
):

    pregunta = (
        obtener_pregunta_profesor(
            id_pregunta,
            profesor.id_profesor,
            db
        )
    )

    if not pregunta:

        raise HTTPException(
            status_code=404,
            detail="Pregunta no encontrada"
        )

    return pregunta
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)

from sqlalchemy.orm import Session

import unicodedata

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
    PreguntaOut,
    PreguntaBancoOut,
    PreguntaUpdate
)

from app.core.auth import (
    get_current_profesor
)

from app.services.preguntas_service import (
    obtener_preguntas_profesor,
    buscar_preguntas_profesor,
    obtener_pregunta_profesor,
    actualizar_pregunta_profesor,
    cambiar_estado_pregunta
)

from typing import Optional

router = APIRouter(
    prefix="/preguntas",
    tags=["Preguntas"]
)
from app.services.excel_service import (
    leer_excel_preguntas,
    respuesta_valida
)

from fastapi.responses import FileResponse
import os
from pathlib import Path


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

    # ==========================================
    # VALIDAR COMPETENCIA
    # ==========================================

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

    # ==========================================
    # VALIDAR TEMA
    # ==========================================

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

    # ==========================================
    # VALIDAR SUBMÓDULO
    # ==========================================

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

    # ==========================================
    # VALIDAR EXTENSIÓN
    # ==========================================

    if not archivo.filename.lower().endswith(".xlsx"):

        raise HTTPException(
            status_code=400,
            detail="Solo se permiten archivos .xlsx"
        )

    # ==========================================
    # LEER Y VALIDAR EXCEL
    # (excel_service realiza todas las validaciones)
    # ==========================================

    df = leer_excel_preguntas(
        archivo
    )

    total_preguntas = len(df)

    importadas = 0

    rechazadas = 0

    errores = []

    # ==========================================
    # PROCESAR PREGUNTAS
    # ==========================================

    for indice, row in df.iterrows():

        respuesta = str(

            row["Respuesta_Correcta"]

        ).strip().upper()

        # --------------------------------------
        # VALIDAR RESPUESTA CORRECTA
        # --------------------------------------

        if not respuesta_valida(respuesta):

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": "La respuesta correcta debe ser A, B, C o D."

            })

            continue

        # --------------------------------------
        # OBTENER DATOS
        # --------------------------------------

        texto_pregunta = str(

            row["Pregunta"]

        ).strip()

        dificultad_original = str(

            row["Dificultad"]

        ).strip()

        dificultad = (

            unicodedata

                .normalize(

                    "NFD",

                    dificultad_original

                )

                .encode(

                    "ascii",

                    "ignore"

                )

                .decode(

                    "utf-8"

                )

                .strip()

                .capitalize()

        )

        opcion_a = str(row["Opcion_A"]).strip()

        opcion_b = str(row["Opcion_B"]).strip()

        opcion_c = str(row["Opcion_C"]).strip()

        opcion_d = str(row["Opcion_D"]).strip()

        justificacion = str(

            row["Justificacion"]

        ).strip()

        # --------------------------------------
        # VALIDAR CAMPOS VACÍOS
        # --------------------------------------

        if texto_pregunta == "":

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": "La pregunta está vacía."

            })

            continue

        if (

            opcion_a == "" or

            opcion_b == "" or

            opcion_c == "" or

            opcion_d == ""

        ):

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": "Todas las opciones deben tener contenido."

            })

            continue
        
        # --------------------------------------
        # VALIDAR OPCIONES DUPLICADAS
        # --------------------------------------

        opciones = [

            opcion_a,

            opcion_b,

            opcion_c,

            opcion_d

        ]

        if len(set(opciones)) != 4:

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": "Las opciones de respuesta no pueden estar repetidas."

            })

            continue
        
        # --------------------------------------
        # VALIDAR JUSTIFICACIÓN
        # --------------------------------------

        if justificacion == "":

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": "La justificación no puede estar vacía."

            })

            continue

        # --------------------------------------
        # VALIDAR DIFICULTAD
        # --------------------------------------

        if dificultad not in [

            "Basico",

            "Intermedio",

            "Avanzado"

        ]:

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": "La dificultad debe ser Básico, Intermedio o Avanzado."

            })

            continue

        # --------------------------------------
        # VALIDAR DUPLICADOS
        # --------------------------------------

        existe = (

            db.query(PreguntaCompetencia)

            .filter(

                PreguntaCompetencia.id_profesor == profesor.id_profesor,

                PreguntaCompetencia.id_competencia == id_competencia,

                PreguntaCompetencia.id_submodulo == id_submodulo,

                PreguntaCompetencia.id_tema == id_tema,

                PreguntaCompetencia.pregunta == texto_pregunta

            )

            .first()

        )

        if existe:

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": "La pregunta ya existe en el banco de preguntas."

            })

            continue

        # --------------------------------------
        # INSERTAR PREGUNTA
        # --------------------------------------

        try:

            pregunta = PreguntaCompetencia(

                id_profesor=profesor.id_profesor,

                id_nivel=profesor.id_nivel,

                id_competencia=id_competencia,

                id_submodulo=id_submodulo,

                id_tema=id_tema,

                dificultad=dificultad,

                pregunta=texto_pregunta,

                opcion_a=opcion_a,

                opcion_b=opcion_b,

                opcion_c=opcion_c,

                opcion_d=opcion_d,

                respuesta_correcta=respuesta,

                justificacion=justificacion,

                estado=True

            )

            db.add(pregunta)

            importadas += 1

        except Exception as e:

            rechazadas += 1

            errores.append({

                "fila": indice + 2,

                "motivo": f"Error interno: {str(e)}"

            })

            continue

        try:

            db.commit()

        except Exception:

            db.rollback()

            raise HTTPException(

                status_code=500,

                detail="Ocurrió un error al guardar las preguntas."

            )

    # ==========================================
    # DETERMINAR RESULTADO
    # ==========================================

    if importadas == total_preguntas:

        estado = "exito"

        mensaje = (
            "Todas las preguntas fueron importadas correctamente."
        )

    elif importadas > 0:

        estado = "advertencia"

        mensaje = (
            f"Se importaron {importadas} preguntas y "
            f"{rechazadas} fueron rechazadas."
        )

    else:

        estado = "error"

        mensaje = (
            "No fue posible importar ninguna pregunta."
        )

    # ==========================================
    # RESPUESTA
    # ==========================================

    return {

        "estado": estado,

        "total_preguntas": total_preguntas,

        "preguntas_importadas": importadas,

        "preguntas_rechazadas": rechazadas,

        "mensaje": mensaje,

        "errores": errores

    }

# ==========================================
# OBTENER PREGUNTAS
# ==========================================

@router.get(
    "/mis-preguntas",
    response_model=list[PreguntaBancoOut]
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
    response_model=list[PreguntaBancoOut]
)
def buscar_preguntas(
    id_competencia: Optional[int] = None,
    id_submodulo: Optional[int] = None,
    id_tema: Optional[int] = None,
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
# DESCARGAR PLANTILLA
# ==========================================

@router.get(
    "/descargar-plantilla"
)
def descargar_plantilla():

    ruta = (

        Path(__file__)

        .resolve()

        .parent.parent

        / "templates"

        / "Plantilla_Importacion_Preguntas.xlsx"

    )

    if not ruta.exists():

        raise HTTPException(

            status_code=404,

            detail="La plantilla no existe."

        )

    return FileResponse(

        path=ruta,

        filename="Plantilla_Importacion_Preguntas.xlsx",

        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

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

# ==========================================
# ACTUALIZAR PREGUNTA
# ==========================================

@router.put(

    "/{id_pregunta}",

    response_model=PreguntaOut

)

def actualizar_pregunta(

    id_pregunta:int,

    datos:PreguntaUpdate,

    profesor:Profesor=Depends(

        get_current_profesor

    ),

    db:Session=Depends(

        get_db

    )

):

    pregunta = obtener_pregunta_profesor(

        id_pregunta,

        profesor.id_profesor,

        db

    )

    if not pregunta:

        raise HTTPException(

            status_code=404,

            detail="Pregunta no encontrada."

        )

    try:

        return actualizar_pregunta_profesor(

            pregunta,

            datos,

            db

        )

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )
        
# ==========================================
# CAMBIAR ESTADO
# ==========================================

@router.patch(
    "/{id_pregunta}/estado",
    response_model=PreguntaOut
)
def cambiar_estado(

    id_pregunta:int,

    profesor:Profesor=Depends(
        get_current_profesor
    ),

    db:Session=Depends(get_db)

):

    pregunta = obtener_pregunta_profesor(

        id_pregunta,

        profesor.id_profesor,

        db

    )

    if not pregunta:

        raise HTTPException(

            status_code=404,

            detail="Pregunta no encontrada."

        )

    return cambiar_estado_pregunta(

        pregunta,

        db

    )
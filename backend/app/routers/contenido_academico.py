from fastapi import (

    APIRouter,

    Depends,

    HTTPException,

    UploadFile,

    File,

    Form

)

from sqlalchemy.orm import Session

from app.database.database import (

    get_db

)

from app.services.contenido_academico_service import (

    obtener_resumen_contenido,

    obtener_contenidos,

    crear_contenido,

    obtener_contenido,

    actualizar_contenido,

    cambiar_estado_contenido,

    eliminar_contenido,

    obtener_contenidos_estudiante

)

from app.schemas.contenido_academico import (

    ContenidoUpdate

)

from app.core.auth import get_current_profesor

from app.models.usuarios import Profesor

from app.core.auth import get_current_estudiante

from app.models.usuarios import Estudiante

router = APIRouter(

    prefix="/contenido-academico",

    tags=[

        "Contenido Académico"

    ]

)

# ==========================================
# RESUMEN
# ==========================================

@router.get(

    "/resumen"

)

def resumen(

    db: Session = Depends(

        get_db

    )

):

    return obtener_resumen_contenido(

        db

    )
    
# ==========================================
# LISTA
# ==========================================

@router.get(

    "/lista"

)

def lista(

    db: Session = Depends(

        get_db

    )

):

    return obtener_contenidos(

        db

    )
    

# ==========================================
# CREAR
# ==========================================

@router.post(
    "/crear"
)
def registrar_contenido(

    profesor: Profesor = Depends(
        get_current_profesor
    ),

    archivo: UploadFile = File(...),

    id_competencia: int = Form(...),

    id_submodulo: int = Form(...),

    id_tema: int = Form(...),

    id_tipo_contenido: int = Form(...),

    nombre_contenido: str = Form(...),

    descripcion_contenido: str = Form(None),

    db: Session = Depends(
        get_db
    )

):

    respuesta = crear_contenido(

        db,

        archivo,

        profesor.id_profesor,

        id_competencia,

        id_submodulo,

        id_tema,

        id_tipo_contenido,

        nombre_contenido,

        descripcion_contenido

    )

    if "error" in respuesta:

        raise HTTPException(

            status_code=400,

            detail=respuesta["error"]

        )

    return respuesta

# ==========================================
# CONTENIDO ESTUDIANTE
# ==========================================

@router.get(

    "/estudiante"

)

def contenido_estudiante(

    estudiante:Estudiante = Depends(

        get_current_estudiante

    ),

    db:Session = Depends(

        get_db

    )

):

    return obtener_contenidos_estudiante(

        db,

        estudiante

    )

# ==========================================
# DETALLE
# ==========================================

@router.get(

    "/{id_contenido}"

)

def detalle(

    id_contenido: int,

    db: Session = Depends(

        get_db

    )

):

    contenido = obtener_contenido(

        db,

        id_contenido

    )

    if contenido is None:

        raise HTTPException(

            status_code=404,

            detail="Contenido no encontrado."

        )

    return contenido


# ==========================================
# ACTUALIZAR
# ==========================================

@router.put(

    "/actualizar/{id_contenido}"

)

def actualizar(

    id_contenido: int,

    datos: ContenidoUpdate,

    db: Session = Depends(

        get_db

    )

):

    respuesta = actualizar_contenido(

        db,

        id_contenido,

        datos

    )

    if "error" in respuesta:

        raise HTTPException(

            status_code=400,

            detail=respuesta["error"]

        )

    return respuesta



# ==========================================
# CAMBIAR ESTADO
# ==========================================

@router.patch(

    "/estado/{id_contenido}"

)

def cambiar_estado(

    id_contenido: int,

    db: Session = Depends(

        get_db

    )

):

    respuesta = cambiar_estado_contenido(

        db,

        id_contenido

    )

    if respuesta is None:

        raise HTTPException(

            status_code=404,

            detail="Contenido no encontrado."

        )

    return respuesta


# ==========================================
# ELIMINAR
# ==========================================

@router.delete(

    "/eliminar/{id_contenido}"

)

def eliminar(

    id_contenido: int,

    db: Session = Depends(

        get_db

    )

):

    respuesta = eliminar_contenido(

        db,

        id_contenido

    )

    if respuesta is None:

        raise HTTPException(

            status_code=404,

            detail="Contenido no encontrado."

        )

    return respuesta


    
    

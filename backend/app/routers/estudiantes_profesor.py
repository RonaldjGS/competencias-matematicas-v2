from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import (
    get_db
)

from app.schemas.estudiantes import (
    EstudianteProfesorCreate
)

from app.services.estudiantes_profesor_service import (
    obtener_resumen_estudiantes,
    obtener_estudiantes,
    crear_estudiante,
    obtener_perfil_estudiante,
    obtener_rendimiento_competencias,
    obtener_rendimiento_submodulos,
    obtener_rendimiento_temas,
    obtener_submodulos_estudiante,
    obtener_comparacion_curso,
    obtener_rendimiento_dificultad,
    obtener_historial_evaluaciones,
    obtener_detalle_historial
)

router = APIRouter(

    prefix="/estudiantes-profesor",

    tags=["Estudiantes Profesor"]

)


# ==========================================
# RESUMEN GESTIÓN DE ESTUDIANTES
# ==========================================

@router.get(

    "/resumen/{id_profesor}"

)

def resumen_estudiantes(

    id_profesor: int,

    db: Session = Depends(get_db)

):

    datos = obtener_resumen_estudiantes(

        db,

        id_profesor

    )

    if not datos:

        raise HTTPException(

            status_code=404,

            detail="Profesor no encontrado"

        )

    return datos

# ==========================================
# LISTA DE ESTUDIANTES
# ==========================================

@router.get(

    "/lista/{id_profesor}"

)

def lista_estudiantes(

    id_profesor:int,

    db: Session = Depends(get_db)

):

    return obtener_estudiantes(

        db,

        id_profesor

    )
    

# ==========================================
# CREAR ESTUDIANTE
# ==========================================

@router.post(

    "/crear/{id_profesor}"

)

def registrar_estudiante(

    id_profesor: int,

    datos: EstudianteProfesorCreate,

    db: Session = Depends(get_db)

):

    respuesta = crear_estudiante(

        db,

        id_profesor,

        datos

    )

    if respuesta is None:

        raise HTTPException(

            status_code=404,

            detail="Profesor no encontrado"

        )

    if "error" in respuesta:

        raise HTTPException(

            status_code=400,

            detail=respuesta["error"]

        )

    return respuesta

# ==========================================
# PERFIL DEL ESTUDIANTE
# ==========================================

@router.get(

    "/perfil/{id_estudiante}"

)

def perfil_estudiante(

    id_estudiante:int,

    db:Session=Depends(get_db)

):

    perfil=obtener_perfil_estudiante(

        db,

        id_estudiante

    )

    if perfil is None:

        raise HTTPException(

            status_code=404,

            detail="Estudiante no encontrado"

        )

    return perfil


# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

@router.get(

    "/competencias/{id_estudiante}"

)

def rendimiento_competencias(

    id_estudiante:int,

    db:Session=Depends(get_db)

):

    return obtener_rendimiento_competencias(

        db,

        id_estudiante

    )
    
# ==========================================
# RENDIMIENTO POR SUBMÓDULO
# ==========================================

@router.get(

    "/submodulos/{id_estudiante}/{id_competencia}"

)

def rendimiento_submodulos(

    id_estudiante:int,

    id_competencia:int,

    db:Session=Depends(get_db)

):

    return obtener_rendimiento_submodulos(

        db,

        id_estudiante,

        id_competencia

    )
    
@router.get(

    "/perfil/{id_estudiante}/temas/{id_competencia}/{id_submodulo}"

)

def rendimiento_temas(

    id_estudiante:int,

    id_competencia:int,

    id_submodulo:int,

    db:Session=Depends(

        get_db

    )

):

    return obtener_rendimiento_temas(

        db,

        id_estudiante,

        id_competencia,

        id_submodulo

    )
    
# ==========================================
# FILTRO SUBMÓDULOS
# ==========================================

@router.get(

    "/submodulos-filtro/{id_estudiante}/{id_competencia}"

)

def submodulos_filtro(

    id_estudiante:int,

    id_competencia:int,

    db:Session=Depends(get_db)

):

    return obtener_submodulos_estudiante(

        db,

        id_estudiante,

        id_competencia

    )
    

# ==========================================
# COMPARACIÓN CON EL CURSO
# ==========================================

@router.get(

    "/comparacion-curso/{id_estudiante}"

)

def comparacion_curso(

    id_estudiante: int,

    db: Session = Depends(
        get_db
    )

):

    datos = obtener_comparacion_curso(

        db,

        id_estudiante

    )

    if datos is None:

        raise HTTPException(

            status_code=404,

            detail="Estudiante no encontrado"

        )

    return datos

@router.get(
    "/perfil/{id_estudiante}/precision-dificultad"
)
def obtener_precision_dificultad_estudiante(

    id_estudiante: int,

    db: Session = Depends(get_db)

):

    return obtener_rendimiento_dificultad(

        db,

        id_estudiante

    )
    
    
# ==========================================
# HISTORIAL DE EVALUACIONES
# ==========================================

@router.get(

    "/historial/{id_estudiante}"

)

def historial_evaluaciones(

    id_estudiante:int,

    db:Session=Depends(

        get_db

    )

):

    return obtener_historial_evaluaciones(

        db,

        id_estudiante

    )
    

# ==========================================
# DETALLE DEL HISTORIAL
# ==========================================

@router.get(

    "/historial/detalle/{id_resultado}"

)

def detalle_historial(

    id_resultado:int,

    db:Session=Depends(

        get_db

    )

):

    return obtener_detalle_historial(

        db,

        id_resultado

    )  
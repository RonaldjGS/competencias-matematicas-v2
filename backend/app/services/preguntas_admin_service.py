from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.evaluaciones import (
    PreguntaCompetencia
)

from app.models.usuarios import (
    Profesor
)

from app.models.catalogos import (
    NivelEducativo
)

from app.models.academico import (
    Competencia,
    Submodulo,
    Tema
)
from datetime import datetime

def obtener_preguntas_admin(

    db: Session,

    id_nivel: int | None = None,

    id_profesor: int | None = None,

    id_competencia: int | None = None,

    id_submodulo: int | None = None,

    id_tema: int | None = None

):
    consulta = (

        db.query(

            PreguntaCompetencia.id_pregunta,

            Profesor.nombre_profesor.label(

                "profesor"

            ),

            NivelEducativo.nombre_nivel.label(

                "nivel"

            ),

            PreguntaCompetencia.pregunta,

            PreguntaCompetencia.dificultad,

            PreguntaCompetencia.estado

        )

        .join(

            Profesor,

            Profesor.id_profesor ==

            PreguntaCompetencia.id_profesor

        )

        .join(

            NivelEducativo,

            NivelEducativo.id_nivel ==

            PreguntaCompetencia.id_nivel

        )

    )
    
    if id_nivel:

        consulta = consulta.filter(

            PreguntaCompetencia.id_nivel ==

            id_nivel

        )

    if id_profesor:

        consulta = consulta.filter(

            PreguntaCompetencia.id_profesor ==

            id_profesor

        )

    if id_competencia:

        consulta = consulta.filter(

            PreguntaCompetencia.id_competencia ==

            id_competencia

        )

    if id_submodulo:

        consulta = consulta.filter(

            PreguntaCompetencia.id_submodulo ==

            id_submodulo

        )

    if id_tema:

        consulta = consulta.filter(

            PreguntaCompetencia.id_tema ==

            id_tema

        )
        
    return (

        consulta

        .order_by(

            PreguntaCompetencia.id_pregunta.desc()

        )

        .all()

    )

# ==========================================
# DETALLE PREGUNTA
# ==========================================

def obtener_detalle_pregunta_admin(

    db: Session,

    id_pregunta:int

):

    return (

        db.query(

            PreguntaCompetencia.id_pregunta,

            PreguntaCompetencia.id_profesor,

            PreguntaCompetencia.id_nivel,

            PreguntaCompetencia.id_competencia,

            PreguntaCompetencia.id_submodulo,

            PreguntaCompetencia.id_tema,

            Profesor.nombre_profesor.label(
                "profesor"
            ),

            NivelEducativo.nombre_nivel.label(
                "nivel"
            ),

            Competencia.nombre_competencia.label(
                "competencia"
            ),

            Submodulo.nombre_submodulo.label(
                "submodulo"
            ),

            Tema.nombre_tema.label(
                "tema"
            ),

            PreguntaCompetencia.pregunta,

            PreguntaCompetencia.opcion_a,

            PreguntaCompetencia.opcion_b,

            PreguntaCompetencia.opcion_c,

            PreguntaCompetencia.opcion_d,

            PreguntaCompetencia.respuesta_correcta,

            PreguntaCompetencia.justificacion,

            PreguntaCompetencia.dificultad,

            PreguntaCompetencia.estado

        )

        .join(

            Profesor,

            Profesor.id_profesor ==

            PreguntaCompetencia.id_profesor

        )

        .join(

            NivelEducativo,

            NivelEducativo.id_nivel ==

            PreguntaCompetencia.id_nivel

        )

        .join(

            Competencia,

            Competencia.id_competencia ==

            PreguntaCompetencia.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo ==

            PreguntaCompetencia.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema ==

            PreguntaCompetencia.id_tema

        )

        .filter(

            PreguntaCompetencia.id_pregunta ==

            id_pregunta

        )

        .first()

    )
    
    
# ==========================================
# ACTUALIZAR PREGUNTA
# ==========================================

def actualizar_pregunta_admin(

    pregunta: PreguntaCompetencia,

    datos,

    db: Session

):
    duplicada = (

        db.query(

            PreguntaCompetencia

        )

        .filter(

            PreguntaCompetencia.id_profesor ==

            pregunta.id_profesor,

            PreguntaCompetencia.id_competencia ==

            datos.id_competencia,

            PreguntaCompetencia.id_submodulo ==

            datos.id_submodulo,

            PreguntaCompetencia.id_tema ==

            datos.id_tema,

            PreguntaCompetencia.pregunta ==

            datos.pregunta,

            PreguntaCompetencia.id_pregunta !=

            pregunta.id_pregunta

        )

        .first()

    )

    if duplicada:

        raise ValueError(

            "Ya existe una pregunta con el mismo enunciado."

        )
        
    if datos.pregunta.strip() == "":

        raise ValueError(

            "La pregunta no puede estar vacía."

        )
        
    opciones = [

        datos.opcion_a.strip(),

        datos.opcion_b.strip(),

        datos.opcion_c.strip(),

        datos.opcion_d.strip()

    ]

    if "" in opciones:

        raise ValueError(

            "Todas las opciones deben tener contenido."

        )

    if len(set(opciones)) != 4:

        raise ValueError(

            "Las opciones no pueden repetirse."

        )
        
    opciones = [

        datos.opcion_a.strip(),

        datos.opcion_b.strip(),

        datos.opcion_c.strip(),

        datos.opcion_d.strip()

    ]

    if "" in opciones:

        raise ValueError(

            "Todas las opciones deben tener contenido."

        )

    if len(set(opciones)) != 4:

        raise ValueError(

            "Las opciones no pueden repetirse."

        )
    if datos.justificacion is None or datos.justificacion.strip() == "":

        raise ValueError(

            "Debe ingresar una justificación."

        )
        
    if datos.dificultad not in [

        "Basico",

        "Intermedio",

        "Avanzado"

    ]:

        raise ValueError(

            "Dificultad inválida."

        )
    
    pregunta.id_competencia = datos.id_competencia

    pregunta.id_submodulo = datos.id_submodulo

    pregunta.id_tema = datos.id_tema

    pregunta.dificultad = datos.dificultad

    pregunta.pregunta = datos.pregunta

    pregunta.opcion_a = datos.opcion_a

    pregunta.opcion_b = datos.opcion_b

    pregunta.opcion_c = datos.opcion_c

    pregunta.opcion_d = datos.opcion_d

    pregunta.respuesta_correcta = datos.respuesta_correcta

    pregunta.justificacion = datos.justificacion

    pregunta.update_at = datetime.now()

    db.commit()

    db.refresh(pregunta)
    
    return obtener_detalle_pregunta_admin(

        db,

        pregunta.id_pregunta

    )
    
# ==========================================
# CAMBIAR ESTADO
# ==========================================

def cambiar_estado_pregunta_admin(

    db: Session,

    id_pregunta: int

):

    pregunta = (

        db.query(

            PreguntaCompetencia

        )

        .filter(

            PreguntaCompetencia.id_pregunta ==

            id_pregunta

        )

        .first()

    )

    if not pregunta:

        raise HTTPException(

            status_code=404,

            detail="La pregunta no existe."

        )

    pregunta.estado = not pregunta.estado

    db.commit()

    db.refresh(

        pregunta

    )

    return {

        "mensaje": "Estado actualizado correctamente.",

        "estado": pregunta.estado

    }
    
# ==========================================
# ELIMINAR PREGUNTA
# ==========================================

def eliminar_pregunta_admin(

    db: Session,

    id_pregunta: int

):

    pregunta = (

        db.query(

            PreguntaCompetencia

        )

        .filter(

            PreguntaCompetencia.id_pregunta ==

            id_pregunta

        )

        .first()

    )

    if not pregunta:

        raise HTTPException(

            status_code=404,

            detail="La pregunta no existe."

        )

    db.delete(

        pregunta

    )

    db.commit()

    return {

        "mensaje":

        "Pregunta eliminada correctamente."

    }
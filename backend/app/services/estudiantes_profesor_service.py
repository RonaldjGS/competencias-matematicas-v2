from sqlalchemy.orm import Session

from sqlalchemy import func, desc

from app.models.usuarios import (
    Profesor,
    Estudiante
)

from app.models.academico import (
    Competencia,
    Submodulo,
    Tema
)

from app.models.evaluaciones import (
    ResultadoQuiz,
    IntentoDetalle,
    PreguntaCompetencia,
    IntentoQuiz
)

from app.models.catalogos import (
    Carrera,
    Provincia,
    Ciudad,
    Rol
)

from app.core.auth import (
    hash_password
)




# ==========================================
# RESUMEN GESTIÓN DE ESTUDIANTES
# ==========================================

def obtener_resumen_estudiantes(
    db: Session,
    id_profesor: int
):

    profesor = (

        db.query(
            Profesor
        )

        .filter(

            Profesor.id_profesor
            ==
            id_profesor

        )

        .first()

    )

    if not profesor:

        return None

    id_nivel = profesor.id_nivel

    # ======================================
    # TOTAL ESTUDIANTES
    # ======================================

    total_estudiantes = (

        db.query(

            func.count(
                Estudiante.id_estudiante
            )

        )

        .filter(

            Estudiante.id_nivel
            ==
            id_nivel

        )

        .scalar()

    )

    # ======================================
    # PROMEDIO GENERAL
    # ======================================

    promedio_general = (

        db.query(

            func.avg(
                ResultadoQuiz.porcentaje
            )

        )

        .join(

            Estudiante,

            Estudiante.id_estudiante
            ==
            ResultadoQuiz.id_estudiante

        )

        .filter(

            Estudiante.id_nivel
            ==
            id_nivel

        )

        .scalar()

    )

    if promedio_general is None:

        promedio_general = 0

    # ======================================
    # TOTAL TEST REALIZADOS
    # ======================================

    total_test = (

        db.query(

            func.count(
                ResultadoQuiz.id_resultado
            )

        )

        .join(

            Estudiante,

            Estudiante.id_estudiante
            ==
            ResultadoQuiz.id_estudiante

        )

        .filter(

            Estudiante.id_nivel
            ==
            id_nivel

        )

        .scalar()

    )

    # ======================================
    # MEJOR PUNTUACIÓN
    # ======================================

    mejor_puntaje = (

        db.query(

            func.max(
                ResultadoQuiz.porcentaje
            )

        )

        .join(

            Estudiante,

            Estudiante.id_estudiante
            ==
            ResultadoQuiz.id_estudiante

        )

        .filter(

            Estudiante.id_nivel
            ==
            id_nivel

        )

        .scalar()

    )

    if mejor_puntaje is None:

        mejor_puntaje = 0

    return {

        "total_estudiantes": total_estudiantes,

        "promedio_general": round(
            promedio_general,
            1
        ),

        "test_realizados": total_test,

        "mejor_puntaje": round(
            mejor_puntaje,
            1
        )

    }
    

# ==========================================
# LISTA DE ESTUDIANTES
# ==========================================

def obtener_estudiantes(
    db: Session,
    id_profesor: int
):

    profesor = (

        db.query(
            Profesor
        )

        .filter(

            Profesor.id_profesor
            ==
            id_profesor

        )

        .first()

    )

    if not profesor:

        return []

    estudiantes = (

        db.query(

            Estudiante.id_estudiante,

            Estudiante.nombre_estudiante,

            Estudiante.correo_estudiante,

            Estudiante.estado,

            func.avg(
                ResultadoQuiz.porcentaje
            ).label(
                "promedio"
            ),

            func.count(
                ResultadoQuiz.id_resultado
            ).label(
                "evaluaciones"
            ),

            func.max(
                ResultadoQuiz.porcentaje
            ).label(
                "mejor_puntaje"
            )

        )

        .outerjoin(

            ResultadoQuiz,

            ResultadoQuiz.id_estudiante
            ==
            Estudiante.id_estudiante

        )

        .filter(

            Estudiante.id_nivel
            ==
            profesor.id_nivel

        )

        .group_by(

            Estudiante.id_estudiante,

            Estudiante.nombre_estudiante,

            Estudiante.correo_estudiante,

            Estudiante.estado

        )

        .order_by(

            Estudiante.nombre_estudiante

        )

        .all()

    )

    resultado = []

    for fila in estudiantes:

        resultado.append({

            "id_estudiante": fila.id_estudiante,

            "nombre": fila.nombre_estudiante,

            "correo": fila.correo_estudiante,

            "promedio": round(
                fila.promedio or 0,
                1
            ),

            "evaluaciones": fila.evaluaciones,

            "mejor_puntaje": round(
                fila.mejor_puntaje or 0,
                1
            ),

            "estado": "Activo" if fila.estado else "Inactivo"

        })

    return resultado


def crear_estudiante(

    db: Session,

    id_profesor: int,

    datos

):

    profesor = (

        db.query(

            Profesor

        )

        .filter(

            Profesor.id_profesor
            ==
            id_profesor

        )

        .first()

    )

    if not profesor:

        return None

    correo = (

        db.query(

            Estudiante

        )

        .filter(

            Estudiante.correo_estudiante
            ==
            datos.correo_estudiante

        )

        .first()

    )

    if correo:

        return {

            "error":

            "El correo ya se encuentra registrado"

        }


    ciudad = (

        db.query(

            Ciudad

        )

        .filter(

            Ciudad.id_ciudad
            ==
            datos.id_ciudad

        )

        .first()

    )

    if not ciudad:

        return {

            "error":

            "Ciudad no válida"

        }

    if datos.id_carrera:

        carrera = (

            db.query(

                Carrera

            )

            .filter(

                Carrera.id_carrera
                ==
                datos.id_carrera

            )

            .first()

        )

        if not carrera:

            return {

                "error":

                "Carrera no válida"

            }

    rol = (

        db.query(

            Rol

        )

        .filter(

            Rol.id_rol == 3

        )

        .first()

    )

    nuevo = Estudiante(

        nombre_estudiante=datos.nombre_estudiante,

        institucion_edu=datos.institucion_edu,

        id_nivel=profesor.id_nivel,

        id_tipo_institucion=datos.id_tipo_institucion,

        id_carrera=datos.id_carrera,

        id_ciudad=datos.id_ciudad,

        correo_estudiante=datos.correo_estudiante,

        password_hash=hash_password(datos.password),

        id_rol=3,

        estado=datos.estado

    )

    db.add(

        nuevo

    )

    db.commit()

    db.refresh(

        nuevo

    )

    return {

        "mensaje":

        "Estudiante registrado correctamente"

    }
    


def obtener_perfil_estudiante(

    db,

    id_estudiante:int

):

    estudiante=(

        db.query(

            Estudiante

        )

        .filter(

            Estudiante.id_estudiante
            ==
            id_estudiante

        )

        .first()

    )

    if not estudiante:

        return None

    estadisticas=(

        db.query(

            func.count(

                ResultadoQuiz.id_resultado

            ).label(

                "tests"

            ),

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            ),

            func.max(

                ResultadoQuiz.porcentaje

            ).label(

                "mejor"

            ),

            func.avg(

                ResultadoQuiz.tiempo_segundos

            ).label(

                "tiempo"

            )

        )

        .filter(

            ResultadoQuiz.id_estudiante
            ==
            id_estudiante

        )

        .first()

    )

    tiempo_promedio=0

    if estadisticas.tiempo:

        tiempo_promedio=round(

            estadisticas.tiempo/60,

            1

        )

    return{

        "nombre":

        estudiante.nombre_estudiante,

        "correo":

        estudiante.correo_estudiante,

        "estado":

        "Activo"

        if estudiante.estado

        else

        "Inactivo",

        "fecha_registro":

        estudiante.created_at.strftime(

            "%d/%m/%Y"

        )

        if estudiante.created_at

        else

        "",

        "tests_realizados":

        estadisticas.tests or 0,

        "promedio_general":

        round(

            estadisticas.promedio or 0,

            1

        ),

        "mejor_puntaje":

        round(

            estadisticas.mejor or 0,

            1

        ),

        # Tiempo promedio expresado en minutos
        "tiempo_promedio":

        tiempo_promedio,

        # Tiempo original en segundos
        "tiempo_promedio_segundos":

        int(

            estadisticas.tiempo or 0

        )

    }
    
# ==========================================
# RENDIMIENTO POR COMPETENCIA
# ==========================================

def obtener_rendimiento_competencias(

    db,

    id_estudiante:int

):

    datos=(

        db.query(

            Competencia.nombre_competencia,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

        )

        .join(

            Competencia,

            Competencia.id_competencia
            ==
            ResultadoQuiz.id_competencia

        )

        .filter(

            ResultadoQuiz.id_estudiante
            ==
            id_estudiante

        )

        .group_by(

            Competencia.id_competencia,

            Competencia.nombre_competencia

        )

        .order_by(

            Competencia.id_competencia

        )

        .all()

    )

    return[

        {

            "competencia":

            fila.nombre_competencia,

            "promedio":

            round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    

# ==========================================
# RENDIMIENTO POR SUBMÓDULO
# ==========================================

def obtener_rendimiento_submodulos(

    db,

    id_estudiante:int,

    id_competencia:int

):

    datos=(

        db.query(

            Submodulo.nombre_submodulo,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo
            ==
            ResultadoQuiz.id_submodulo

        )

        .filter(

            ResultadoQuiz.id_estudiante
            ==
            id_estudiante,

            ResultadoQuiz.id_competencia
            ==
            id_competencia

        )

        .group_by(

            Submodulo.id_submodulo,

            Submodulo.nombre_submodulo

        )

        .order_by(

            Submodulo.nombre_submodulo

        )

        .all()

    )

    return [

        {

            "submodulo":

            fila.nombre_submodulo,

            "promedio":

            round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    

def obtener_rendimiento_temas(

    db: Session,

    id_estudiante: int,

    id_competencia: int,

    id_submodulo: int

):

    resultados=(

        db.query(

            Tema.nombre_tema,

            func.avg(

                ResultadoQuiz.porcentaje

            ).label(

                "promedio"

            )

        )

        .join(

            ResultadoQuiz,

            ResultadoQuiz.id_tema==Tema.id_tema

        )

        .filter(

            ResultadoQuiz.id_estudiante==id_estudiante,

            ResultadoQuiz.id_competencia==id_competencia,

            ResultadoQuiz.id_submodulo==id_submodulo

        )

        .group_by(

            Tema.id_tema,

            Tema.nombre_tema

        )

        .order_by(

            Tema.id_tema

        )

        .all()

    )

    return [

        {

            "tema":r.nombre_tema,

            "promedio":round(

                r.promedio,

                1

            )

        }

        for r in resultados

    ]
    

# ==========================================
# SUBMÓDULOS DEL ESTUDIANTE POR COMPETENCIA
# ==========================================

def obtener_submodulos_estudiante(

    db:Session,

    id_estudiante:int,

    id_competencia:int

):

    submodulos=(

        db.query(

            ResultadoQuiz.id_submodulo,

            Submodulo.nombre_submodulo

        )

        .join(

            Submodulo,

            ResultadoQuiz.id_submodulo==

            Submodulo.id_submodulo

        )

        .filter(

            ResultadoQuiz.id_estudiante==

            id_estudiante,

            ResultadoQuiz.id_competencia==

            id_competencia

        )

        .distinct()

        .all()

    )

    return[

        {

            "id_submodulo":

            s.id_submodulo,

            "nombre_submodulo":

            s.nombre_submodulo

        }

        for s in submodulos

    ]
    

# ==========================================
# COMPARACIÓN CON EL CURSO
# ==========================================

def obtener_comparacion_curso(
    db: Session,
    id_estudiante: int
):

    estudiante = (
        db.query(Estudiante)
        .filter(
            Estudiante.id_estudiante == id_estudiante
        )
        .first()
    )

    if estudiante is None:

        return None

    promedio_estudiante = (
        db.query(
            func.avg(
                ResultadoQuiz.porcentaje
            )
        )
        .filter(
            ResultadoQuiz.id_estudiante == id_estudiante
        )
        .scalar()
    )

    if promedio_estudiante is None:

        promedio_estudiante = 0

    estudiantes_nivel = (
        db.query(
            Estudiante.id_estudiante
        )
        .filter(
            Estudiante.id_nivel ==
            estudiante.id_nivel
        )
        .all()
    )

    promedios = []

    for alumno in estudiantes_nivel:

        promedio = (
            db.query(
                func.avg(
                    ResultadoQuiz.porcentaje
                )
            )
            .filter(
                ResultadoQuiz.id_estudiante ==
                alumno.id_estudiante
            )
            .scalar()
        )

        if promedio is not None:

            promedios.append(promedio)

    if len(promedios) > 0:

        promedio_curso = (
            sum(promedios)
            /
            len(promedios)
        )

    else:

        promedio_curso = 0

    diferencia = (
        promedio_estudiante
        -
        promedio_curso
    )

    if diferencia >= 15:

        estado = "excelente"

        mensaje = (
            "Excelente rendimiento. "
            "Estás muy por encima del promedio del curso."
        )

    elif diferencia >= 5:

        estado = "superior"

        mensaje = (
            "Estás por encima del promedio del curso."
        )

    elif diferencia > -5:

        estado = "igual"

        mensaje = (
            "Tu rendimiento es similar al promedio del curso."
        )

    elif diferencia > -15:

        estado = "inferior"

        mensaje = (
            "Tu rendimiento está ligeramente por debajo del promedio del curso."
        )

    else:

        estado = "bajo"

        mensaje = (
            "Tu rendimiento está muy por debajo del promedio del curso."
        )

    return {

        "promedio_estudiante": round(
            promedio_estudiante,
            2
        ),

        "promedio_curso": round(
            promedio_curso,
            2
        ),

        "diferencia": round(
            diferencia,
            2
        ),

        "estado": estado,

        "mensaje": mensaje

    }
    
# ==========================================
# RENDIMIENTO POR DIFICULTAD
# ==========================================

def obtener_rendimiento_dificultad(

    db,
    id_estudiante: int,
    id_competencia=None,
    id_submodulo=None,
    id_tema=None

):

    consulta = (

        db.query(

            ResultadoQuiz.dificultad,

            func.avg(
                ResultadoQuiz.porcentaje
            ).label("promedio")

        )

        .filter(

            ResultadoQuiz.id_estudiante == id_estudiante

        )

    )

    # ======================================
    # FILTROS OPCIONALES
    # ======================================

    if id_competencia:

        consulta = consulta.filter(

            ResultadoQuiz.id_competencia == id_competencia

        )

    if id_submodulo:

        consulta = consulta.filter(

            ResultadoQuiz.id_submodulo == id_submodulo

        )

    if id_tema:

        consulta = consulta.filter(

            ResultadoQuiz.id_tema == id_tema

        )

    # ======================================

    datos = (

        consulta

        .group_by(

            ResultadoQuiz.dificultad

        )

        .order_by(

            ResultadoQuiz.dificultad

        )

        .all()

    )

    return [

        {

            "dificultad": fila.dificultad,

            "promedio": round(

                fila.promedio,

                1

            )

        }

        for fila in datos

    ]
    
# ==========================================
# HISTORIAL DE EVALUACIONES
# ==========================================

def obtener_historial_evaluaciones(

    db:Session,

    id_estudiante:int

):

    historial=(

        db.query(

            ResultadoQuiz.id_resultado,

            ResultadoQuiz.fecha,

            ResultadoQuiz.porcentaje,

            ResultadoQuiz.nivel_desempeno,

            ResultadoQuiz.dificultad,

            ResultadoQuiz.tiempo_segundos,

            Competencia.nombre_competencia,

            Submodulo.nombre_submodulo,

            Tema.nombre_tema

        )

        .join(

            Competencia,

            Competencia.id_competencia==ResultadoQuiz.id_competencia

        )

        .join(

            Submodulo,

            Submodulo.id_submodulo==ResultadoQuiz.id_submodulo

        )

        .join(

            Tema,

            Tema.id_tema==ResultadoQuiz.id_tema

        )

        .filter(

            ResultadoQuiz.id_estudiante==id_estudiante

        )

        .order_by(

            ResultadoQuiz.fecha.desc()

        )

        .all()

    )

    return [

        {

            "id_resultado":item.id_resultado,

            "fecha":item.fecha,

            "competencia":item.nombre_competencia,

            "submodulo":item.nombre_submodulo,

            "tema":item.nombre_tema,

            "porcentaje":round(

                item.porcentaje,

                1

            ),

            "nivel_desempeno":item.nivel_desempeno,

            "dificultad":item.dificultad,

            "tiempo_segundos":item.tiempo_segundos

        }

        for item in historial

    ]
    
# ==========================================
# DETALLE DEL HISTORIAL
# ==========================================

def obtener_detalle_historial(

    db:Session,

    id_resultado:int

):

    resultado = (

        db.query(

            ResultadoQuiz

        )

        .filter(

            ResultadoQuiz.id_resultado == id_resultado

        )

        .first()

    )

    if not resultado:

        return []

    detalle = (

        db.query(

            IntentoDetalle,

            PreguntaCompetencia

        )

        .join(

            PreguntaCompetencia,

            PreguntaCompetencia.id_pregunta == IntentoDetalle.id_pregunta

        )

        .filter(

            IntentoDetalle.id_intento == resultado.id_intento

        )

        .order_by(

            IntentoDetalle.numero_pregunta

        )

        .all()

    )

    return [

        {

            "numero_pregunta":fila.IntentoDetalle.numero_pregunta,

            "pregunta":fila.PreguntaCompetencia.pregunta,

            "opcion_a":fila.PreguntaCompetencia.opcion_a,

            "opcion_b":fila.PreguntaCompetencia.opcion_b,

            "opcion_c":fila.PreguntaCompetencia.opcion_c,

            "opcion_d":fila.PreguntaCompetencia.opcion_d,

            "respuesta_correcta":fila.PreguntaCompetencia.respuesta_correcta,

            "respuesta_estudiante":fila.IntentoDetalle.respuesta_estudiante,

            "es_correcta":fila.IntentoDetalle.es_correcta,

            "justificacion":fila.PreguntaCompetencia.justificacion,

            "tiempo_respuesta":fila.IntentoDetalle.tiempo_respuesta

        }

        for fila in detalle

    ]    
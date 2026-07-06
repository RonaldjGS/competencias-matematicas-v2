from sqlalchemy.orm import Session

from app.models.usuarios import (

    Profesor,

    Estudiante,

    Administrador

)

# ==========================================
# RESUMEN DASHBOARD
# ==========================================

def obtener_resumen_dashboard(

    db: Session

):

    total_profesores = (

        db.query(

            Profesor

        ).count()

    )

    total_estudiantes = (

        db.query(

            Estudiante

        ).count()

    )

    total_administradores = (

        db.query(

            Administrador

        ).count()

    )

    total_usuarios = (

        total_profesores +

        total_estudiantes +

        total_administradores

    )

    return {

        "total_usuarios":

        total_usuarios,

        "total_profesores":

        total_profesores,

        "total_estudiantes":

        total_estudiantes,

        "total_administradores":

        total_administradores

    }
    

# ==========================================
# LISTA USUARIOS
# ==========================================

def obtener_usuarios(

    db: Session

):

    resultado = []

    # ==========================
    # PROFESORES
    # ==========================

    profesores = db.query(

        Profesor

    ).all()

    for profesor in profesores:

        resultado.append({

            "id":

            profesor.id_profesor,

            "tipo_usuario":

            "Profesor",

            "nombre":

            profesor.nombre_profesor,

            "correo":

            profesor.correo,

            "estado":

            "Activo"

            if profesor.estado

            else

            "Inactivo"

        })

    # ==========================
    # ESTUDIANTES
    # ==========================

    estudiantes = db.query(

        Estudiante

    ).all()

    for estudiante in estudiantes:

        resultado.append({

            "id":

            estudiante.id_estudiante,

            "tipo_usuario":

            "Estudiante",

            "nombre":

            estudiante.nombre_estudiante,

            "correo":

            estudiante.correo_estudiante,

            "estado":

            "Activo"

            if estudiante.estado

            else

            "Inactivo"

        })

    # ==========================
    # ADMINISTRADORES
    # ==========================

    administradores = db.query(

        Administrador

    ).all()

    for admin in administradores:

        resultado.append({

            "id":

            admin.id_admin,

            "tipo_usuario":

            "Administrador",

            "nombre":

            admin.nombre_admin,

            "correo":

            admin.correo_admin,

            "estado":

            "Activo"

        })
        
        resultado.sort(

            key=lambda usuario: (

                usuario["tipo_usuario"],

                usuario["nombre"]

            )

        )

    return resultado


from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.usuarios import (

    Profesor,

    Estudiante,

    Administrador

)

from app.models.catalogos import (

    NivelEducativo,

    Carrera,

    TipoInstitucion,

    PeriodoAcademico

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

            "id": profesor.id_profesor,

            "tipo_usuario": "Profesor",

            "nombre": profesor.nombre_profesor,

            "correo": profesor.correo,

            "estado":
                "Activo"
                if profesor.estado
                else
                "Inactivo",

            "id_nivel":
                profesor.id_nivel,

            "id_periodo":
                None

        })

    # ==========================
    # ESTUDIANTES
    # ==========================

    estudiantes = db.query(

        Estudiante

    ).all()

    for estudiante in estudiantes:

       resultado.append({

            "id": estudiante.id_estudiante,

            "tipo_usuario": "Estudiante",

            "nombre": estudiante.nombre_estudiante,

            "correo": estudiante.correo_estudiante,

            "estado":
                "Activo"
                if estudiante.estado
                else
                "Inactivo",

            "id_nivel":
                estudiante.id_nivel,

            "id_periodo":
                estudiante.id_periodo

        })

    # ==========================
    # ADMINISTRADORES
    # ==========================

    administradores = db.query(

        Administrador

    ).all()

    for admin in administradores:

        resultado.append({

            "id": admin.id_admin,

            "tipo_usuario": "Administrador",

            "nombre": admin.nombre_admin,

            "correo": admin.correo_admin,

            "estado": "Activo",

            "id_nivel": None,

            "id_periodo": None

        })
        
        resultado.sort(

            key=lambda usuario: (

                usuario["tipo_usuario"],

                usuario["nombre"]

            )

        )

    return resultado

# ==========================================
# DETALLE USUARIO
# ==========================================

def obtener_detalle_usuario(

    db: Session,

    tipo_usuario: str,

    id: int

):

    # ==========================
    # ESTUDIANTE
    # ==========================

    if tipo_usuario == "Estudiante":

        estudiante = (

            db.query(

                Estudiante

            )

            .filter(

                Estudiante.id_estudiante == id

            )

            .first()

        )

        if not estudiante:

            raise HTTPException(

                status_code=404,

                detail="Usuario no encontrado"

            )

        return {

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

            "Inactivo",

            "id_nivel":

            estudiante.id_nivel,

            "nivel":

            estudiante.nivel.nombre_nivel

            if estudiante.nivel

            else None,

            "id_carrera":

            estudiante.id_carrera,

            "carrera":

            estudiante.carrera.nombre_carrera

            if estudiante.carrera

            else None,

            "id_tipo_institucion":

            None,

            "tipo_institucion":

            None,

            "id_periodo":

            estudiante.id_periodo,

            "periodo":

            estudiante.periodo.nombre_periodo

            if estudiante.periodo

            else None,

            "fecha_registro":

            estudiante.created_at.strftime(

                "%d/%m/%Y"

            )

            if estudiante.created_at

            else None,

            "ultimo_acceso":

            estudiante.ultimo_acceso.strftime(

                "%d/%m/%Y %H:%M"

            )

            if estudiante.ultimo_acceso

            else None

        }

    # ==========================
    # PROFESOR
    # ==========================

    if tipo_usuario == "Profesor":

        profesor = (

            db.query(

                Profesor

            )

            .filter(

                Profesor.id_profesor == id

            )

            .first()

        )

        if not profesor:

            raise HTTPException(

                status_code=404,

                detail="Usuario no encontrado"

            )

        return {

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

            "Inactivo",

            "id_nivel":

            profesor.id_nivel,

            "nivel":

            profesor.nivel.nombre_nivel

            if profesor.nivel

            else None,

            "id_carrera":

            profesor.id_carrera,

            "carrera":

            profesor.carrera.nombre_carrera

            if (
                profesor.id_nivel != 1 and
                profesor.carrera
            )

            else None,

            "id_tipo_institucion":

            profesor.id_tipo_institucion,

            # Solo Bachillerato

            "tipo_institucion":

            profesor.tipo_institucion.nombre_tipo

            if (
                profesor.id_nivel == 1 and
                profesor.tipo_institucion
            )

            else None,

            "id_periodo":

            None,

            "periodo":

            None,

            "fecha_registro":

            profesor.created_at.strftime(

                "%d/%m/%Y"

            )

            if profesor.created_at

            else None,

            "ultimo_acceso":

            profesor.ultimo_acceso.strftime(

                "%d/%m/%Y %H:%M"

            )

            if profesor.ultimo_acceso

            else None

        }

    # ==========================
    # ADMINISTRADOR
    # ==========================

    if tipo_usuario == "Administrador":

        admin = (

            db.query(

                Administrador

            )

            .filter(

                Administrador.id_admin == id

            )

            .first()

        )

        if not admin:

            raise HTTPException(

                status_code=404,

                detail="Usuario no encontrado"

            )

        return {

            "id":

            admin.id_admin,

            "tipo_usuario":

            "Administrador",

            "nombre":

            admin.nombre_admin,

            "correo":

            admin.correo_admin,

            "estado":

            "Activo",

            "id_nivel":

            None,

            "nivel":

            None,

            "id_carrera":

            None,

            "carrera":

            None,

            "id_tipo_institucion":

            None,

            "tipo_institucion":

            None,

            "id_periodo":

            None,

            "periodo":

            None,

            "fecha_registro":

            admin.created_at.strftime(

                "%d/%m/%Y"

            )

            if admin.created_at

            else None,

            "ultimo_acceso": None

        }

    return None


def actualizar_usuario_admin(

    db: Session,

    tipo_usuario: str,

    id_usuario: int,

    datos

):
    if tipo_usuario == "Administrador":

        admin = db.query(

            Administrador

        ).filter(

            Administrador.id_admin == id_usuario

        ).first()

        if not admin:

            return None

        admin.nombre_admin = datos.nombre

        admin.correo_admin = datos.correo
        
    elif tipo_usuario == "Profesor":

        profesor = db.query(

            Profesor

        ).filter(

            Profesor.id_profesor == id_usuario

        ).first()

        if not profesor:

            return None

        profesor.nombre_profesor = datos.nombre

        profesor.correo = datos.correo

        profesor.id_nivel = datos.id_nivel
        
    elif tipo_usuario == "Estudiante":

        estudiante = db.query(

            Estudiante

        ).filter(

            Estudiante.id_estudiante == id_usuario

        ).first()

        if not estudiante:

            return None

        estudiante.nombre_estudiante = datos.nombre

        estudiante.correo_estudiante = datos.correo

        estudiante.id_nivel = datos.id_nivel

        estudiante.id_periodo = datos.id_periodo
        
    db.commit()

    return {

        "mensaje":

        "Usuario actualizado correctamente"

    }
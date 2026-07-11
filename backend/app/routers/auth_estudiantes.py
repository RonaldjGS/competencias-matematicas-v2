from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.usuarios import (
    Estudiante
)

from app.models.catalogos import (
    Rol,
    NivelEducativo,
    PeriodoAcademico,
    Carrera,
    TipoInstitucion,
    Ciudad
)

from app.schemas.estudiantes import (
    EstudianteCreate,
    EstudianteLogin,
    TokenResponse,
    ChangePasswordRequest,
    VerificarCorreoRequest,
    VerificarCorreoResponse,
    ResetPasswordRequest
)

from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_estudiante
)

router = APIRouter(
    prefix="/auth/estudiantes",
    tags=["Auth Estudiantes"]
)

@router.post("/register")
def register_estudiante(
    data: EstudianteCreate,
    db: Session = Depends(get_db)
):

    correo_existente = (
        db.query(Estudiante)
        .filter(
            Estudiante.correo_estudiante ==
            data.correo_estudiante
        )
        .first()
    )

    if correo_existente:

        raise HTTPException(
            status_code=400,
            detail="El correo ya está registrado"
        )

    nivel = (
        db.query(NivelEducativo)
        .filter(
            NivelEducativo.id_nivel ==
            data.id_nivel
        )
        .first()
    )

    if not nivel:

        raise HTTPException(
            status_code=400,
            detail="Nivel educativo no válido"
        )
        
    periodo = (

        db.query(

            PeriodoAcademico

        )

        .filter(

            PeriodoAcademico.id_periodo ==

            data.id_periodo

        )

        .first()

    )

    if not periodo:

        raise HTTPException(

            status_code=400,

            detail="Periodo académico no válido"

        )

    if not periodo.estado:

        raise HTTPException(

            status_code=400,

            detail="El período académico se encuentra inactivo"

        )

    if periodo.id_nivel != data.id_nivel:

        raise HTTPException(

            status_code=400,

            detail="El período no pertenece al nivel educativo seleccionado"

        )

    ciudad = (
        db.query(Ciudad)
        .filter(
            Ciudad.id_ciudad ==
            data.id_ciudad
        )
        .first()
    )

    if not ciudad:

        raise HTTPException(
            status_code=400,
            detail="Ciudad no válida"
        )

    if data.id_carrera:

        carrera = (
            db.query(Carrera)
            .filter(
                Carrera.id_carrera ==
                data.id_carrera
            )
            .first()
        )

        if not carrera:

            raise HTTPException(
                status_code=400,
                detail="Carrera no válida"
            )

    if data.id_tipo_institucion:

        tipo = (
            db.query(TipoInstitucion)
            .filter(
                TipoInstitucion.id_tipo ==
                data.id_tipo_institucion
            )
            .first()
        )

        if not tipo:

            raise HTTPException(
                status_code=400,
                detail="Tipo de institución no válido"
            )

    rol_estudiante = (
        db.query(Rol)
        .filter(
            Rol.nombre_rol == "Estudiante"
        )
        .first()
    )

    if not rol_estudiante:

        raise HTTPException(
            status_code=500,
            detail="Rol estudiante no configurado"
        )

    nuevo_estudiante = Estudiante(

        nombre_estudiante=data.nombre_estudiante,

        institucion_edu=data.institucion_edu,

        id_nivel=data.id_nivel,

        id_periodo=data.id_periodo,

        id_tipo_institucion=data.id_tipo_institucion,

        id_carrera=data.id_carrera,

        id_ciudad=data.id_ciudad,

        correo_estudiante=data.correo_estudiante,

        password_hash=hash_password(
            data.password
        ),

        id_rol=rol_estudiante.id_rol,

        estado=True

    )

    db.add(
        nuevo_estudiante
    )

    db.commit()

    db.refresh(
        nuevo_estudiante
    )

    return {
        "mensaje":
        "Estudiante registrado correctamente"
    }

@router.post(
    "/login",
    response_model=TokenResponse
)
def login_estudiante(
    data: EstudianteLogin,
    db: Session = Depends(get_db)
):

    estudiante = (
        db.query(Estudiante)
        .filter(
            Estudiante.correo_estudiante ==
            data.correo_estudiante
        )
        .first()
    )

    if not estudiante:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    if not verify_password(
        data.password,
        estudiante.password_hash
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    if not estudiante.estado:

        raise HTTPException(
            status_code=403,
            detail="Usuario inactivo"
        )

    token = create_access_token(
        {
            "sub": str(
                estudiante.id_estudiante
            ),
            "tipo": "estudiante"
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {

            "id_estudiante":
            estudiante.id_estudiante,

            "nombre_estudiante":
            estudiante.nombre_estudiante,

            "correo_estudiante":
            estudiante.correo_estudiante,

            "id_nivel":
            estudiante.id_nivel,
            
            "nombre_nivel":
            estudiante.nivel.nombre_nivel

        }
    }
    
# ==========================================
# VERIFICAR CORREO
# ==========================================

@router.post(

    "/verificar-correo",

    response_model=VerificarCorreoResponse

)
def verificar_correo(

    data: VerificarCorreoRequest,

    db: Session = Depends(get_db)

):

    estudiante = (

        db.query(

            Estudiante

        )

        .filter(

            Estudiante.correo_estudiante ==

            data.correo_estudiante

        )

        .first()

    )

    if not estudiante:

        return VerificarCorreoResponse(

            existe=False,

            nombre_estudiante=None

        )

    return VerificarCorreoResponse(

        existe=True,

        nombre_estudiante=

            estudiante.nombre_estudiante

    )
    
# ==========================================
# RESTABLECER CONTRASEÑA
# ==========================================

@router.put(

    "/reset-password"

)
def reset_password(

    data: ResetPasswordRequest,

    db: Session = Depends(get_db)

):

    estudiante = (

        db.query(

            Estudiante

        )

        .filter(

            Estudiante.correo_estudiante ==

            data.correo_estudiante

        )

        .first()

    )

    if not estudiante:

        raise HTTPException(

            status_code=404,

            detail="El correo no se encuentra registrado"

        )

    estudiante.password_hash = hash_password(

        data.new_password

    )

    db.commit()

    return {

        "message":

        "Contraseña actualizada correctamente"

    }
    
@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    estudiante: Estudiante = Depends(
        get_current_estudiante
    ),
    db: Session = Depends(get_db)
):

    if not verify_password(
        data.current_password,
        estudiante.password_hash
    ):

        raise HTTPException(
            status_code=400,
            detail="La contraseña actual es incorrecta"
        )

    estudiante.password_hash = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message":
        "Contraseña actualizada correctamente"
    }
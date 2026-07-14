from pydantic import BaseModel

from typing import Optional

# ==========================================
# RESUMEN DASHBOARD
# ==========================================

class DashboardResumen(BaseModel):

    total_usuarios: int

    total_profesores: int

    total_estudiantes: int

    total_administradores: int
    

# ==========================================
# USUARIO ADMIN
# ==========================================

class UsuarioAdmin(BaseModel):

    id: int

    tipo_usuario: str

    nombre: str

    correo: str

    estado: str

    id_nivel: Optional[int] = None

    id_periodo: Optional[int] = None
    

# ==========================================
# DETALLE USUARIO
# ==========================================

class UsuarioDetalle(BaseModel):

    id: int

    tipo_usuario: str

    nombre: str

    correo: str

    estado: str

    # Nivel educativo
    id_nivel: int | None = None

    nivel: str | None = None

    # Carrera
    id_carrera: int | None = None

    carrera: str | None = None

    # Tipo de institución
    id_tipo_institucion: int | None = None

    tipo_institucion: str | None = None

    # Período
    id_periodo: int | None = None

    periodo: str | None = None

    fecha_registro: str

    ultimo_acceso: str | None = None
    
# ==========================================
# ACTUALIZAR USUARIO
# ==========================================

class UsuarioActualizar(BaseModel):

    nombre: str

    correo: str

    id_nivel: int | None = None

    id_periodo: int | None = None

    id_tipo_institucion: int | None = None

    id_carrera: int | None = None
    


# ==========================================
# CAMBIO CONTRASEÑA
# ==========================================

class CambioPasswordAdmin(BaseModel):

    password: str

    
# ==========================================
# CREAR USUARIO
# ==========================================

class UsuarioCrear(BaseModel):

    tipo_usuario: str

    nombre: str

    correo: str

    password: str

    institucion_educativa: str | None = None

    id_nivel: int | None = None

    id_tipo_institucion: int | None = None

    id_carrera: int | None = None

    id_periodo: int | None = None

    id_provincia: int | None = None

    id_ciudad: int | None = None
    
    
# ==========================================
# ROL
# ==========================================

class RolResponse(BaseModel):

    id_rol: int

    nombre_rol: str

    class Config:

        from_attributes = True
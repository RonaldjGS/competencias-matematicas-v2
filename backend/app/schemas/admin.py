from pydantic import BaseModel

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
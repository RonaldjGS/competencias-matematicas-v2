import {

  Component,

  OnInit,

  Inject,

  PLATFORM_ID

} from '@angular/core';

import {

  ChangeDetectorRef

} from '@angular/core';

import {

  CommonModule,

  isPlatformBrowser

} from '@angular/common';

import {

  TopbarAdminComponent

} from '../../../components/topbar-admin/topbar-admin.component';

import Swal from 'sweetalert2';

import {

  SidebarAdminComponent

} from '../../../components/sidebar-admin/sidebar-admin.component';

import {

    AdminService

} from '../../../services/admin.service';

import { CatalogosService } from '../../../services/catalogos.service';

import { FormsModule } from '@angular/forms';


@Component({

  selector: 'app-dashboard-admin',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    TopbarAdminComponent,

    SidebarAdminComponent

  ],

  templateUrl: './dashboard-admin.component.html',

  styleUrl: './dashboard-admin.component.css'

})

export class DashboardAdminComponent implements OnInit {

  nombreAdministrador = '';

  menuAbierto = false;

  resumen: any = {};

  usuarios: any[] = [];

  usuarioSeleccionado: any = null;

  // =====================================
    // MODO EDICIÓN
    // =====================================

    modoEdicion = false;

    usuarioEdicion: any = {};

  detalleUsuario: any = null;

  usuariosFiltrados: any[] = [];

    // =====================================
    // FILTROS
    // =====================================

    textoBusqueda = '';

    rolSeleccionado = 'Todos';

    nivelSeleccionado = 0;

    periodoSeleccionado = 0;

    // Catálogos

    niveles: any[] = [];

    periodos: any[] = [];

  cargando = false;

  usuariosPaginados: any[] = [];

  paginaActual = 1;

  elementosPorPagina = 10;

  totalPaginas = 0;

  paginas: number[] = [];

  tiposInstitucion:any[]=[];

    carreras:any[]=[];

    mostrarModalPassword=false;

    passwordNueva='';

    confirmarPassword='';

    mostrarPasswordNueva = false;

    mostrarConfirmarPassword = false;

    // =====================================
    // NUEVO USUARIO
    // =====================================

    mostrarModalNuevoUsuario = false;

    mostrarPasswordNuevo = false;

    nuevoUsuario:any={

        tipo_usuario:'',

        nombre:'',

        institucion_educativa:'',

        id_nivel:null,

        id_tipo_institucion:null,

        id_carrera:null,

        provincias:null,

        ciudades:null,

        id_periodo:null,

        id_provincia:null,

        id_ciudad:null,

        correo:'',

        password:''

    };

    provincias:any[]=[];

    ciudades:any[]=[];

    roles:any[]=[];

    constructor(

        private adminService: AdminService,

        private catalogosService: CatalogosService,

        private cdr: ChangeDetectorRef

    ) {}

  ngOnInit(): void {

    if (

      isPlatformBrowser(

        PLATFORM_ID as any

      )

    ) {

      this.nombreAdministrador =

        localStorage.getItem(

          'nombre_admin'

        ) || 'Administrador';

    }

    this.cargarResumen();

    this.cargarUsuarios();

    this.cargarNiveles();

    this.cargarTiposInstitucion();

    this.cargarCarreras();
    
    this.cargarRoles();

    this.cargarProvincias();

  }

    // =====================================
    // RESUMEN DASHBOARD
    // =====================================

    cargarResumen(): void {

        this.adminService

            .obtenerResumen()

            .subscribe({

                next: (respuesta) => {

                    this.resumen = respuesta;

                    console.log(

                        this.resumen

                    );

                    this.refrescarVista();

                },

                error: (error) => {

                    console.error(

                        error

                    );

                }

            });

    }

    private refrescarVista():void{

        this.cdr.detectChanges();

    }

    // =====================================
    // LISTA DE USUARIOS
    // =====================================

    cargarUsuarios(): void {

        this.cargando = true;

        this.adminService

            .obtenerUsuarios()

            .subscribe({

                next: (respuesta) => {

                    this.usuarios = respuesta;

                    this.aplicarFiltros();

                    this.refrescarVista();

                    this.cargando = false;

                    console.log(

                        this.usuarios

                    );

                },

                error: (error) => {

                    console.error(

                        error

                    );

                    this.cargando = false;

                }

            });

    }

    // =====================================
    // ACTUALIZAR PAGINACIÓN
    // =====================================

    actualizarPaginacion(): void {

        this.totalPaginas = Math.ceil(

            this.usuariosFiltrados.length /

            this.elementosPorPagina

        );

        const inicio =

            (this.paginaActual - 1) *

            this.elementosPorPagina;

        const fin =

            inicio +

            this.elementosPorPagina;

        this.usuariosPaginados =

            this.usuariosFiltrados.slice(

                inicio,

                fin

            );

        this.paginas = Array(

            this.totalPaginas

        ).fill(0).map(

            (_, index) => index + 1

        );

    }

    // =====================================
    // PÁGINA ANTERIOR
    // =====================================

    paginaAnterior(): void {

        if (

            this.paginaActual > 1

        ) {

            this.paginaActual--;

            this.actualizarPaginacion();

        }

    }

    // =====================================
    // PÁGINA SIGUIENTE
    // =====================================

    paginaSiguiente(): void {

        if (

            this.paginaActual < this.totalPaginas

        ) {

            this.paginaActual++;

            this.actualizarPaginacion();

        }

    }

    // =====================================
    // IR A PÁGINA
    // =====================================

    irPagina(

        pagina: number

    ): void {

        this.paginaActual = pagina;

        this.actualizarPaginacion();

    }

    // =====================================
    // SELECCIONAR USUARIO
    // =====================================

    seleccionarUsuario(

        usuario: any

    ): void {

        this.usuarioSeleccionado = usuario;

        this.cargarDetalleUsuario(

            usuario.tipo_usuario,

            usuario.id

        );
        this.refrescarVista();

    }
    // =====================================
    // NIVELES
    // =====================================

    cargarNiveles(): void {

        this.catalogosService

            .obtenerNiveles()

            .subscribe({

                next: (respuesta: any) => {

                    this.niveles = respuesta;

                    this.refrescarVista();

                },

                error: (error) => {

                    console.error(error);

                }

            });

    }

    // =====================================
    // PERIODOS
    // =====================================

    cargarPeriodosPorNivel(): void {

        this.periodos = [];

        this.periodoSeleccionado = 0;

        if (

            this.nivelSeleccionado === 0

        ){

            return;

        }

        this.catalogosService

            .obtenerPeriodosPorNivel(

                this.nivelSeleccionado

            )

            .subscribe({

                next:(respuesta:any)=>{

                    this.periodos = respuesta;

                    this.refrescarVista();

                },

                error:(error)=>{

                    console.error(error);

                }

            });

    }

    // =====================================
    // CAMBIO DE ROL
    // =====================================

    cambioRol(): void {

        this.nivelSeleccionado = 0;

        this.periodoSeleccionado = 0;

        this.periodos = [];

        if (

            this.rolSeleccionado === 'Profesor' ||

            this.rolSeleccionado === 'Estudiante'

        ){

            this.aplicarFiltros();

            return;

        }

        this.aplicarFiltros();

        this.refrescarVista();

    }

    // =====================================
    // CAMBIO NIVEL
    // =====================================

    cambioNivel(): void {

        if (

            this.rolSeleccionado === 'Estudiante'

        ){

            this.cargarPeriodosPorNivel();

        }

        this.aplicarFiltros();

        this.refrescarVista();

    }

    // =====================================
    // FILTRAR USUARIOS
    // =====================================

    aplicarFiltros(): void {

        this.usuariosFiltrados =

            this.usuarios.filter(usuario => {

                // ===========================
                // BUSCADOR
                // ===========================

                const coincideNombre =

                    usuario.nombre

                    .toLowerCase()

                    .includes(

                        this.textoBusqueda

                        .toLowerCase()

                    );

                // ===========================
                // ROL
                // ===========================

                const coincideRol =

                    this.rolSeleccionado === 'Todos'

                    ||

                    usuario.tipo_usuario ===

                    this.rolSeleccionado;

                // ===========================
                // NIVEL
                // ===========================

                const coincideNivel =

                    this.nivelSeleccionado === 0

                    ||

                    usuario.id_nivel ===

                    this.nivelSeleccionado;

                // ===========================
                // PERIODO
                // ===========================

                const coincidePeriodo =

                    this.periodoSeleccionado === 0

                    ||

                    usuario.id_periodo ===

                    this.periodoSeleccionado;

                return (

                    coincideNombre &&

                    coincideRol &&

                    coincideNivel &&

                    coincidePeriodo

                );

            });

        this.paginaActual = 1;

        this.actualizarPaginacion();

        this.refrescarVista();

    }

    // =====================================
    // DETALLE USUARIO
    // =====================================

    cargarDetalleUsuario(

        tipoUsuario: string,

        id: number

    ): void {

        this.adminService

            .obtenerDetalleUsuario(

                tipoUsuario,

                id

            )

            .subscribe({

                next: (respuesta) => {

                    this.detalleUsuario = respuesta;

                    console.log(

                        this.detalleUsuario

                    );

                    this.refrescarVista();

                },

                error: (error) => {

                    console.error(

                        error

                    );

                }

            });

    }

    // =====================================
    // EDITAR USUARIO
    // =====================================

    editarUsuario(): void {

        this.modoEdicion = true;

        this.usuarioEdicion = {

            ...this.detalleUsuario

        };

    }

    // =====================================
    // CANCELAR EDICIÓN
    // =====================================

    cancelarEdicion(): void {

        this.modoEdicion = false;

        this.usuarioEdicion = {};

    }

    // =====================================
    // GUARDAR CAMBIOS
    // =====================================

    guardarUsuario(): void {

        const datos = {

            nombre: this.usuarioEdicion.nombre,

            correo: this.usuarioEdicion.correo,

            id_nivel: this.usuarioEdicion.id_nivel,

            id_periodo: this.usuarioEdicion.id_periodo,

            id_tipo_institucion: this.usuarioEdicion.id_tipo_institucion,

            id_carrera: this.usuarioEdicion.id_carrera

        };

        console.log(
            'Datos enviados:',
            datos
        );

        this.adminService

            .actualizarUsuario(

                this.usuarioSeleccionado.tipo_usuario,

                this.usuarioSeleccionado.id,

                datos

            )

            .subscribe({

                next: () => {

                    console.log(
                        'Actualizado correctamente'
                    );

                    this.modoEdicion = false;

                    this.cargarDetalleUsuario(

                        this.usuarioSeleccionado.tipo_usuario,

                        this.usuarioSeleccionado.id

                    );

                    this.cargarUsuarios();

                    this.refrescarVista();

                },

                error: (error) => {

                    console.log(

                        'Respuesta backend:',

                        error.error

                    );

                    console.error(

                        error

                    );

                }

            });

    }

    cargarTiposInstitucion(): void {

        this.catalogosService

            .obtenerTiposInstitucion()

            .subscribe({

                next:(respuesta:any)=>{

                    this.tiposInstitucion = respuesta;

                    this.refrescarVista();

                }

            });

    }

    cargarCarreras(): void {

        this.catalogosService

            .obtenerCarreras()

            .subscribe({

                next:(respuesta:any)=>{

                    this.carreras = respuesta;

                    this.refrescarVista();

                }

            });

    }

    // =====================================
    // ES BACHILLERATO
    // =====================================

    esBachillerato(): boolean {

        const idNivel = this.modoEdicion
            ? this.usuarioEdicion.id_nivel
            : this.detalleUsuario?.id_nivel;

        return idNivel === 1;

    }

    // =====================================
    // ES UNIVERSIDAD
    // =====================================

    esUniversidad(): boolean {

        return !this.esBachillerato();

    }

    // =====================================
    // MOSTRAR TIPO DE INSTITUCIÓN
    // =====================================

    mostrarTipoInstitucion(): boolean {

        return this.esBachillerato();

    }

    // =====================================
    // MOSTRAR CARRERA
    // =====================================

    mostrarCarrera(): boolean {

        return this.esUniversidad();

    }

    // =====================================
    // MOSTRAR PERIODO
    // =====================================

    mostrarPeriodo(): boolean {

        const tipo = this.detalleUsuario?.tipo_usuario;

        return (

            tipo === 'Estudiante'

            &&

            this.esUniversidad()

        );

    }

    // =====================================
    // CAMBIO DE NIVEL EN EDICIÓN
    // =====================================

    cambioNivelEdicion(): void {

        if (

            this.esBachillerato()

        ){

            this.usuarioEdicion.id_carrera = null;

            this.usuarioEdicion.id_periodo = null;

        }

        else{

            this.usuarioEdicion.id_tipo_institucion = null;

            this.catalogosService

                .obtenerPeriodosPorNivel(

                    this.usuarioEdicion.id_nivel

                )

                .subscribe({

                    next:(respuesta:any)=>{

                        this.periodos = respuesta;

                        this.refrescarVista();

                    }

                });

        }

    }

    abrirModalPassword():void{

        this.passwordNueva='';

        this.confirmarPassword='';

        this.mostrarModalPassword=true;

    }

    cerrarModalPassword(): void {

        this.passwordNueva = '';

        this.confirmarPassword = '';

        this.mostrarPasswordNueva = false;

        this.mostrarConfirmarPassword = false;

        this.mostrarModalPassword = false;

    }

    guardarPassword():void{

        if(

            this.passwordNueva!==

            this.confirmarPassword

        ){

            Swal.fire({

                icon:'error',

                title:'Las contraseñas no coinciden'

            });

            return;

        }

        this.adminService

            .cambiarPassword(

                this.usuarioSeleccionado.tipo_usuario,

                this.usuarioSeleccionado.id,

                this.passwordNueva

            )

            .subscribe({

                next:()=>{

                    this.cerrarModalPassword();

                    setTimeout(()=>{

                        Swal.fire({

                            icon:'success',

                            title:'Contraseña actualizada',

                            text:'La contraseña se cambió correctamente.',

                            confirmButtonColor:'#7c3aed'

                        });

                    },150);

                    this.refrescarVista();

                }

        });

    }


    // =====================================
    // DESACTIVAR USUARIO
    // =====================================

    confirmarCambiarEstadoUsuario(): void {

        const activar =

            this.detalleUsuario.estado === 'Inactivo';

        Swal.fire({

            title: activar

                ? '¿Activar usuario?'

                : '¿Desactivar usuario?',

            text: activar

                ? 'El usuario podrá volver a iniciar sesión.'

                : 'El usuario no podrá iniciar sesión.',

            icon: 'warning',

            showCancelButton: true,

            confirmButtonText: activar

                ? 'Sí, activar'

                : 'Sí, desactivar',

            cancelButtonText: 'Cancelar',

            confirmButtonColor: activar

                ? '#16a34a'

                : '#dc2626'

        }).then(resultado=>{

            if(!resultado.isConfirmed){

                return;

            }

            this.adminService

                .desactivarUsuario(

                    this.usuarioSeleccionado.tipo_usuario,

                    this.usuarioSeleccionado.id

                )

                .subscribe({

                   next: (respuesta: any) => {

                        Swal.fire({

                            icon: 'success',

                            title: respuesta.mensaje,

                            confirmButtonColor: '#7c3aed'

                        });

                        this.cargarUsuarios();

                        this.cargarDetalleUsuario(

                            this.usuarioSeleccionado.tipo_usuario,

                            this.usuarioSeleccionado.id

                        );

                        this.refrescarVista();

                    },

                    error:(error)=>{

                        console.error(error);

                    }

                });

        });

    }

    confirmarEliminarUsuario(): void {

        Swal.fire({

            title:'¿Eliminar usuario?',

            html:`
                <b>Esta acción no se puede deshacer.</b>
                <br><br>
                Se eliminarán todos los datos asociados.
            `,

            icon:'error',

            showCancelButton:true,

            confirmButtonColor:'#dc2626',

            confirmButtonText:'Eliminar',

            cancelButtonText:'Cancelar'

        }).then(resultado=>{

            if(!resultado.isConfirmed){

                return;

            }

            this.adminService

                .eliminarUsuario(

                    this.usuarioSeleccionado.tipo_usuario,

                    this.usuarioSeleccionado.id

                )

                .subscribe({

                    next:()=>{

                        Swal.fire({

                            icon:'success',

                            title:'Usuario eliminado'

                        });

                        this.usuarioSeleccionado = null;

                        this.detalleUsuario = null;

                        this.cargarUsuarios();

                        this.refrescarVista();

                    }

                });

        });

    }

    // =====================================
    // ABRIR MODAL NUEVO USUARIO
    // =====================================

    abrirModalNuevoUsuario():void{

        this.nuevoUsuario={

            tipo_usuario:'',

            nombre:'',

            institucion_educativa:'',

            id_nivel:null,

            id_tipo_institucion:null,

            id_carrera:null,

            id_periodo:null,

            id_provincia:null,

            id_ciudad:null,

            correo:'',

            password:''

        };

        this.resetNuevoUsuario();

        this.mostrarModalNuevoUsuario=true;

    }

    // =====================================
    // CERRAR MODAL NUEVO USUARIO
    // =====================================

    cerrarModalNuevoUsuario():void{

        this.resetNuevoUsuario();

        this.mostrarModalNuevoUsuario=false;

    }

    // =====================================
    // CAMBIO ROL NUEVO USUARIO
    // =====================================

    cambioRolNuevoUsuario(): void {

        this.nuevoUsuario.id_nivel = null;

        this.nuevoUsuario.id_tipo_institucion = null;

        this.nuevoUsuario.id_carrera = null;

        this.nuevoUsuario.id_periodo = null;

        this.nuevoUsuario.id_provincia = null;

        this.nuevoUsuario.id_ciudad = null;

        this.nuevoUsuario.institucion_educativa = '';

    }

    mostrarTipoInstitucionNuevo(): boolean{

        return(

            this.nuevoUsuario.id_nivel==1 &&

            (

                this.nuevoUsuario.tipo_usuario=='Profesor' ||

                this.nuevoUsuario.tipo_usuario=='Estudiante'

            )

        );

    }

    mostrarCarreraNuevo(): boolean{

        return(

            this.nuevoUsuario.id_nivel!=1 &&

            this.nuevoUsuario.id_nivel!=null &&

            (

                this.nuevoUsuario.tipo_usuario=='Profesor' ||

                this.nuevoUsuario.tipo_usuario=='Estudiante'

            )

        );

    }

    mostrarPeriodoNuevo(): boolean{

        return(

            this.nuevoUsuario.tipo_usuario == 'Estudiante' &&

            this.nuevoUsuario.id_nivel != null

        );

    }

    // =====================================
    // CAMBIO NIVEL NUEVO USUARIO
    // =====================================

    cambioNivelNuevoUsuario(): void {

        console.log(
            'Nivel seleccionado:',
            this.nuevoUsuario.id_nivel
        );

        // Reiniciar selecciones dependientes
        this.nuevoUsuario.id_tipo_institucion = null;

        this.nuevoUsuario.id_carrera = null;

        this.nuevoUsuario.id_periodo = null;

        // Si es Bachillerato no hay carrera
        if (

            this.nuevoUsuario.id_nivel == 1

        ){

            this.nuevoUsuario.id_carrera = null;

        }

        // Si es Nivelación o Primer Semestre no hay tipo institución
        else{

            this.nuevoUsuario.id_tipo_institucion = null;

        }

        // Cargar períodos para cualquier nivel
        this.catalogosService

            .obtenerPeriodosPorNivel(

                this.nuevoUsuario.id_nivel

            )

            .subscribe({

                next:(respuesta:any)=>{

                    this.periodos = respuesta;

                    this.refrescarVista();

                },

                error:(error)=>{

                    console.error(error);

                }

            });

    }

    cargarProvincias(): void {

        this.catalogosService

            .obtenerProvincias()

            .subscribe({

                next:(respuesta:any)=>{

                    console.log('Provincias', respuesta);

                    this.provincias = respuesta;

                    this.refrescarVista();

                },

                error:(error)=>{

                    console.error(error);

                }

            });

    }

    // =====================================
    // CAMBIO PROVINCIA NUEVO USUARIO
    // =====================================

    cambioProvinciaNuevoUsuario(): void {

        this.nuevoUsuario.id_ciudad = null;

        this.catalogosService

            .obtenerCiudadesPorProvincia(

                this.nuevoUsuario.id_provincia

            )

            .subscribe({

                next:(respuesta:any)=>{

                    this.ciudades = respuesta;

                    this.refrescarVista();

                }

            });

    }

    // =====================================
    // CARGAR ROLES
    // =====================================

    cargarRoles(): void {

        this.adminService

            .obtenerRoles()

            .subscribe({

                next: (respuesta: any) => {

                    this.roles = respuesta;

                },

                error: (error) => {

                    console.error(error);

                }

            });

    }

    // =====================================
    // REGISTRAR NUEVO USUARIO
    // =====================================

    registrarNuevoUsuario(): void {

        this.adminService

            .crearUsuario(

                this.nuevoUsuario

            )

            .subscribe({

                next:()=>{

                    this.mostrarModalNuevoUsuario = false;

                    Swal.fire({

                        icon:'success',

                        title:'Usuario registrado',

                        text:'El usuario fue registrado correctamente.',

                        confirmButtonColor:'#7c3aed'

                    });

                    this.cargarUsuarios();

                    this.resetNuevoUsuario();

                },

                error:(error)=>{

                    console.error(error);

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:

                            error.error?.detail ||

                            'No fue posible registrar el usuario.',

                        confirmButtonColor:'#7c3aed'

                    });

                }

            });

    }

    // =====================================
    // LIMPIAR FORMULARIO NUEVO USUARIO
    // =====================================

    resetNuevoUsuario(): void {

        this.nuevoUsuario = {

            nombre:'',

            tipo_usuario:'',

            institucion_educativa:'',

            id_nivel:null,

            id_tipo_institucion:null,

            id_carrera:null,

            id_periodo:null,

            id_provincia:null,

            id_ciudad:null,

            correo:'',

            password:''

        };

        this.ciudades = [];

        this.periodos = [];

        this.mostrarPasswordNuevo = false;

    }

}
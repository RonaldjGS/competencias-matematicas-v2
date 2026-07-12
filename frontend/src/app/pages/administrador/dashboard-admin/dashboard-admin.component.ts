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

        this.adminService

            .actualizarUsuario(

                this.usuarioSeleccionado.tipo_usuario,

                this.usuarioSeleccionado.id,

                this.usuarioEdicion

            )

            .subscribe({

                next: () => {

                    this.modoEdicion = false;

                    this.cargarDetalleUsuario(

                        this.usuarioSeleccionado.tipo_usuario,

                        this.usuarioSeleccionado.id

                    );

                    this.cargarUsuarios();

                },

                error: (error) => {

                    console.error(error);

                }

            });

    }

    cargarTiposInstitucion(): void {

        this.catalogosService

            .obtenerTiposInstitucion()

            .subscribe({

                next:(respuesta:any)=>{

                    this.tiposInstitucion = respuesta;

                }

            });

    }

    cargarCarreras(): void {

        this.catalogosService

            .obtenerCarreras()

            .subscribe({

                next:(respuesta:any)=>{

                    this.carreras = respuesta;

                }

            });

    }

}
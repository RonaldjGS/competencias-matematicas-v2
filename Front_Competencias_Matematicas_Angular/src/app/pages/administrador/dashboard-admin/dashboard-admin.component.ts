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

@Component({

  selector: 'app-dashboard-admin',

  standalone: true,

  imports: [

    CommonModule,

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

  usuariosFiltrados: any[] = [];

  cargando = false;

  usuariosPaginados: any[] = [];

  paginaActual = 1;

  elementosPorPagina = 10;

  totalPaginas = 0;

  paginas: number[] = [];

    constructor(

        private adminService: AdminService,

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

                    this.usuariosFiltrados = respuesta;

                    this.paginaActual = 1;

                    this.actualizarPaginacion();

                    this.refrescarVista();

                    this.cargando = false;

                    this.refrescarVista();

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

        console.log(

            'Usuario seleccionado:',

            usuario

        );

        this.refrescarVista();

    }

}
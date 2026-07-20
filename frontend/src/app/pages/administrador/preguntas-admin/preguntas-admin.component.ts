import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopbarAdminComponent } from '../../../components/topbar-admin/topbar-admin.component';
import { SidebarAdminComponent } from '../../../components/sidebar-admin/sidebar-admin.component';

import { FormsModule } from '@angular/forms';

import {

    AdminService

} from '../../../services/admin.service';

import { CatalogosService } from '../../../services/catalogos.service';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-preguntas-admin',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TopbarAdminComponent,
        SidebarAdminComponent
    ],
    templateUrl: './preguntas-admin.component.html',
    styleUrl: './preguntas-admin.component.css'
})
export class PreguntasAdminComponent implements OnInit {

    menuAbierto = false;

    nombreAdministrador = '';

    niveles:any[]=[];

    profesores:any[]=[];

    competencias:any[]=[];

    submodulos:any[]=[];

    temas:any[]=[];

    nivelSeleccionado:number|null=null;

    profesorSeleccionado:number|null=null;

    competenciaSeleccionada:number|null=null;

    submoduloSeleccionado:number|null=null;

    temaSeleccionado:number|null=null;

    preguntas:any[]=[];

    preguntaSeleccionada:any=null;

    paginaActual=1;

    registrosPorPagina=10;

    modoEdicion = false;

    preguntaEditando: any = {};

    constructor(

        private adminService: AdminService,

        private catalogosService: CatalogosService,

        private cdr: ChangeDetectorRef

        

    ) {}
    
    ngOnInit(): void {

        this.nombreAdministrador =
            localStorage.getItem('nombre_admin') ||
            'Administrador';

        this.cargarNiveles();

        this.cargarCompetencias();

        this.cargarSubmodulos();

        this.cargarPreguntas();

    }

    toggleMenu(): void {

        this.menuAbierto = !this.menuAbierto;

    }

    private refrescarVista():void{

        this.cdr.detectChanges();

    }

    cargarNiveles():void{

        this.catalogosService

            .obtenerNiveles()

            .subscribe({

                next:(resp:any)=>{

                    this.niveles=resp;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    cambioNivel():void{

        this.profesorSeleccionado = null;

        this.temaSeleccionado = null;

        this.profesores = [];

        this.temas = [];

        if(this.nivelSeleccionado==null){

            return;

        }

        this.cargarProfesores();

        this.cargarTemas();

        this.refrescarVista();

    }

    cargarProfesores():void{

        if(!this.nivelSeleccionado){

            return;

        }

        this.catalogosService

            .obtenerProfesoresPorNivel(

                this.nivelSeleccionado

            )

            .subscribe({

                next:(resp:any)=>{

                    this.profesores = resp;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    cargarCompetencias():void{

        this.catalogosService

            .obtenerCompetencias()

            .subscribe({

                next:(resp:any)=>{

                    this.competencias = resp;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    cargarSubmodulos():void{

        this.catalogosService

            .obtenerSubmodulos()

            .subscribe({

                next:(resp:any)=>{

                    this.submodulos = resp;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    cargarTemas():void{

        if(!this.nivelSeleccionado){

            return;

        }

        this.catalogosService

            .obtenerTemasPorNivel(

                this.nivelSeleccionado

            )

            .subscribe({

                next:(resp:any)=>{

                    this.temas = resp;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    buscar():void{

        console.log({

            nivel:this.nivelSeleccionado,

            profesor:this.profesorSeleccionado,

            competencia:this.competenciaSeleccionada,

            submodulo:this.submoduloSeleccionado,

            tema:this.temaSeleccionado

        });

        this.refrescarVista();

        this.cargarPreguntas();

    }

    limpiarFiltros():void{

        this.nivelSeleccionado = null;

        this.profesorSeleccionado = null;

        this.competenciaSeleccionada = null;

        this.submoduloSeleccionado = null;

        this.temaSeleccionado = null;

        this.profesores = [];

        this.temas = [];

        this.refrescarVista();

        this.cargarPreguntas();

    }

    seleccionarPregunta(
        pregunta:any
    ):void{

        this.adminService
            .obtenerDetallePregunta(
                pregunta.id_pregunta
            )
            .subscribe({

                next:(resp:any)=>{

                    this.preguntaSeleccionada = resp;

                    // Cargar los temas correspondientes al nivel
                    this.catalogosService
                        .obtenerTemasPorNivel(
                            resp.id_nivel
                        )
                        .subscribe({

                            next:(temas:any)=>{

                                this.temas = temas;

                                this.refrescarVista();

                            },

                            error:(error:any)=>{

                                console.error(error);

                            }

                        });

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    get preguntasPaginadas(){

        const inicio =

            (this.paginaActual-1)

            * this.registrosPorPagina;

        return this.preguntas.slice(

            inicio,

            inicio + this.registrosPorPagina

        );

    }

    get totalPaginas(){

        return Math.ceil(

            this.preguntas.length /

            this.registrosPorPagina

        );

    }

    paginaAnterior():void{

        if(

            this.paginaActual > 1

        ){

            this.paginaActual--;

        }

    }

    paginaSiguiente():void{

        if(

            this.paginaActual <

            this.totalPaginas

        ){

            this.paginaActual++;

        }

    }

    cargarPreguntas():void{

        this.adminService

            .obtenerPreguntas(

                this.nivelSeleccionado ?? undefined,

                this.profesorSeleccionado ?? undefined,

                this.competenciaSeleccionada ?? undefined,

                this.submoduloSeleccionado ?? undefined,

                this.temaSeleccionado ?? undefined

            )

            .subscribe({

                next:(resp:any)=>{

                    this.preguntas = resp;

                    this.paginaActual = 1;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    activarEdicion(): void {

        if (!this.preguntaSeleccionada) {

            return;

        }

        this.preguntaEditando = {

            ...this.preguntaSeleccionada

        };

        this.modoEdicion = true;

    }

    cancelarEdicion(): void {

        this.modoEdicion = false;

        this.preguntaEditando = {};

    }

    guardarCambios(): void {

        if (!this.preguntaEditando) {

            return;

        }

        this.adminService

            .actualizarPreguntaAdmin(

                this.preguntaEditando.id_pregunta,

                this.preguntaEditando

            )

            .subscribe({

                next: (resp: any) => {

                    Swal.fire({

                        icon: 'success',

                        title: 'Pregunta actualizada',

                        text: 'Los cambios se guardaron correctamente.',

                        timer: 1800,

                        showConfirmButton: false

                    });

                    this.preguntaSeleccionada = resp;

                    this.modoEdicion = false;

                    this.cargarPreguntas();

                    this.refrescarVista();

                },

                error: (error: any) => {

                    Swal.fire({

                        icon: 'error',

                        title: 'Error',

                        text: error.error.detail

                    });

                }

            });

    }

    cambiarEstado(): void {

        if (!this.preguntaSeleccionada) {

            return;

        }

        const accion = this.preguntaSeleccionada.estado

            ? 'desactivar'

            : 'activar';

        Swal.fire({

            title: `¿Desea ${accion} esta pregunta?`,

            text: 'Puede volver a cambiar el estado cuando lo desee.',

            icon: 'question',

            showCancelButton: true,

            confirmButtonColor: '#f59e0b',

            cancelButtonColor: '#6b7280',

            confirmButtonText: 'Sí',

            cancelButtonText: 'Cancelar'

        }).then((result)=>{

            if(result.isConfirmed){

                this.adminService

                    .cambiarEstadoPregunta(

                        this.preguntaSeleccionada.id_pregunta

                    )

                    .subscribe({

                        next:()=>{

                            Swal.fire({

                                icon:'success',

                                title:'Estado actualizado',

                                timer:1500,

                                showConfirmButton:false

                            });

                            // Recargar la tabla
                            this.cargarPreguntas();

                            // Volver a cargar el detalle de la pregunta seleccionada
                            this.seleccionarPregunta({

                                id_pregunta:

                                this.preguntaSeleccionada.id_pregunta

                            });

                            this.refrescarVista();

                        },

                        error:(error:any)=>{

                            console.error(error);

                            Swal.fire(

                                'Error',

                                'No se pudo actualizar el estado.',

                                'error'

                            );

                        }

                    });

            }

        });

    }

    eliminarPregunta(): void {

        if(!this.preguntaSeleccionada){

            return;

        }

        Swal.fire({

            title:'¿Eliminar pregunta?',

            text:'Esta acción no se puede deshacer.',

            icon:'warning',

            showCancelButton:true,

            confirmButtonColor:'#dc2626',

            cancelButtonColor:'#6b7280',

            confirmButtonText:'Sí, eliminar',

            cancelButtonText:'Cancelar'

        }).then((result)=>{

            if(!result.isConfirmed){

                return;

            }

            this.adminService

                .eliminarPregunta(

                    this.preguntaSeleccionada.id_pregunta

                )

                .subscribe({

                    next:()=>{

                        Swal.fire({

                            icon:'success',

                            title:'Pregunta eliminada',

                            timer:1600,

                            showConfirmButton:false

                        });

                        // Limpiar panel derecho
                        this.preguntaSeleccionada = null;

                        this.preguntaEditando = null;

                        this.modoEdicion = false;

                        // Recargar la tabla
                        this.cargarPreguntas();

                        this.refrescarVista();

                    },

                    error:(error:any)=>{

                        console.error(error);

                        Swal.fire({

                            icon:'error',

                            title:'Error',

                            text:

                                error.error?.detail ||

                                'No fue posible eliminar la pregunta.'

                        });

                    }

                });

        });

    }

}
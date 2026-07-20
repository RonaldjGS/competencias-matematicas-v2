import {

    Component,

    OnInit,

    ChangeDetectorRef

} from '@angular/core';

import {

    CommonModule

} from '@angular/common';

import {

    FormsModule

} from '@angular/forms';

import {

    TopbarAdminComponent

} from '../../../components/topbar-admin/topbar-admin.component';

import {

    SidebarAdminComponent

} from '../../../components/sidebar-admin/sidebar-admin.component';

import {

    VideoAdminService

} from '../../../services/video-admin.service';

import {

    CatalogosService

} from '../../../services/catalogos.service';

import Swal from 'sweetalert2';

import {

    DomSanitizer,

    SafeResourceUrl

} from '@angular/platform-browser';

@Component({

    selector:'app-videos-admin',

    standalone:true,

    imports:[

        CommonModule,

        FormsModule,

        TopbarAdminComponent,

        SidebarAdminComponent

    ],

    templateUrl:'./videos-admin.component.html',

    styleUrl:'./videos-admin.component.css'

})

export class VideosAdminComponent implements OnInit{

    menuAbierto = false;

    nombreAdministrador = '';

    //======================================
    // DASHBOARD
    //======================================

    resumen:any = {};

    videos:any[] = [];

    videosFiltrados:any[] = [];

    //======================================
    // DETALLE
    //======================================

    videoSeleccionado:any = null;

    videoEditando:any = null;

    modoEdicion = false;

    //======================================
    // CATÁLOGOS
    //======================================

    competencias:any[] = [];

    submodulos:any[] = [];

    temas:any[] = [];

    //======================================
    // FILTROS
    //======================================

    competenciaSeleccionada:number|null = null;

    submoduloSeleccionado:number|null = null;

    temaSeleccionado:number|null = null;

    //======================================
    // MODAL
    // (Se eliminará después)
    //======================================

    mostrarModal = false;

    nuevoVideo:any = {

        titulo:'',

        descripcion:'',

        id_competencia:null,

        id_submodulo:null,

        id_tema:null,

        youtube_url:'',

        actualizado_por:null

    };

    thumbnailPreview = '';

    videoSeguro!:SafeResourceUrl;

    //======================================
    // PAGINACIÓN
    //======================================

    paginaActual = 1;

    registrosPorPagina = 10;

    constructor(

        private videoService:VideoAdminService,

        private catalogosService:CatalogosService,

        private sanitizer:DomSanitizer,

        private cdr:ChangeDetectorRef

    ){}

    ngOnInit():void{

        this.nombreAdministrador =

            localStorage.getItem(

                'nombre_admin'

            ) || 'Administrador';

        this.cargarResumen();

        this.cargarVideos();

        this.cargarCompetencias();

        this.cargarSubmodulos();

        this.cargarTemas();

    }

    toggleMenu():void{

        this.menuAbierto =

            !this.menuAbierto;

    }

    private refrescarVista():void{

        this.cdr.detectChanges();

    }

    //======================================
    // VIDEOS PAGINADOS
    //======================================

    get videosPaginados(){

        const inicio =

            (this.paginaActual - 1)

            * this.registrosPorPagina;

        return this.videosFiltrados.slice(

            inicio,

            inicio + this.registrosPorPagina

        );

    }

    get totalPaginas(){

        return Math.ceil(

            this.videosFiltrados.length /

            this.registrosPorPagina

        );

    }

    paginaAnterior():void{

        if(

            this.paginaActual > 1

        ){

            this.paginaActual--;

        }

        this.refrescarVista();

    }

    paginaSiguiente():void{

        if(

            this.paginaActual <

            this.totalPaginas

        ){

            this.paginaActual++;

        }

        this.refrescarVista();

    }

    //======================================
    // RESUMEN
    //======================================

    cargarResumen():void{

        this.videoService

            .getResumen()

            .subscribe({

                next:(resp:any)=>{

                    this.resumen = resp;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    //======================================
    // VIDEOS
    //======================================

    cargarVideos():void{

        this.videoService

            .getVideos()

            .subscribe({

                next:(resp:any)=>{

                    console.log(resp);

                    this.videos = resp;

                    this.videosFiltrados = [...resp];

                    this.paginaActual = 1;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    //======================================
    // DETALLE VIDEO
    //======================================

    seleccionarVideo(

        video:any

    ):void{

        this.videoService

            .getVideo(

                video.id_video

            )

            .subscribe({

                next:(resp:any)=>{

                    this.videoSeleccionado = resp;

                    this.videoSeguro =
                        this.sanitizer.bypassSecurityTrustResourceUrl(
                            `https://www.youtube.com/embed/${resp.youtube_id}`
                        );

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    //======================================
    // EDITAR
    //======================================

    activarEdicion():void{

        if(

            !this.videoSeleccionado

        ){

            return;

        }

        this.videoEditando = {

            ...this.videoSeleccionado

        };

        this.modoEdicion = true;

        this.refrescarVista();

    }

    //======================================
    // CANCELAR
    //======================================

    cancelarEdicion():void{

        this.videoEditando = {

            ...this.videoSeleccionado

        };

        this.modoEdicion = false;

        this.refrescarVista();

    }

    //======================================
    // GUARDAR CAMBIOS
    //======================================

    guardarCambios():void{

        if(

            !this.videoSeleccionado ||

            !this.videoEditando

        ){

            return;

        }

        this.videoService

            .actualizarVideo(

                this.videoSeleccionado.id_video,

                this.videoEditando

            )

            .subscribe({

                next:()=>{

                    Swal.fire({

                        icon:'success',

                        title:'Video actualizado',

                        text:'Los cambios fueron guardados correctamente.',

                        timer:1800,

                        showConfirmButton:false

                    });

                    this.cargarVideos();

                    this.seleccionarVideo({

                        id_video:

                        this.videoSeleccionado.id_video

                    });

                    this.modoEdicion = false;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:

                            error.error?.detail ||

                            'No fue posible actualizar el video.'

                    });

                }

            });

    }

    //======================================
    // CAMBIAR ESTADO
    //======================================

    cambiarEstado():void{

        if(

            !this.videoSeleccionado

        ){

            return;

        }

        const accion =

            this.videoSeleccionado.estado

            ? 'desactivar'

            : 'activar';

        Swal.fire({

            title:`¿Desea ${accion} este video?`,

            icon:'question',

            showCancelButton:true,

            confirmButtonText:'Sí',

            cancelButtonText:'Cancelar',

            confirmButtonColor:'#7c3aed'

        })

        .then((resultado)=>{

            if(!resultado.isConfirmed){

                return;

            }

            this.videoService

                .actualizarEstado(

                    this.videoSeleccionado.id_video

                )

                .subscribe({

                    next:()=>{

                        Swal.fire({

                            icon:'success',

                            title:'Estado actualizado',

                            timer:1700,

                            showConfirmButton:false

                        });

                        this.cargarVideos();

                        this.seleccionarVideo({

                            id_video:

                            this.videoSeleccionado.id_video

                        });

                    },

                    error:(error:any)=>{

                        console.error(error);

                        Swal.fire({

                            icon:'error',

                            title:'Error',

                            text:

                                error.error?.detail ||

                                'No fue posible cambiar el estado.'

                        });

                    }

                });

        });

    }

    //======================================
    // ELIMINAR
    //======================================

    eliminarVideo():void{

        if(

            !this.videoSeleccionado

        ){

            return;

        }

        Swal.fire({

            title:'¿Eliminar video?',

            text:'Esta acción no podrá deshacerse.',

            icon:'warning',

            showCancelButton:true,

            confirmButtonText:'Eliminar',

            cancelButtonText:'Cancelar',

            confirmButtonColor:'#dc2626'

        })

        .then((resultado)=>{

            if(!resultado.isConfirmed){

                return;

            }

            this.videoService

                .eliminarVideo(

                    this.videoSeleccionado.id_video

                )

                .subscribe({

                    next:()=>{

                        Swal.fire({

                            icon:'success',

                            title:'Video eliminado',

                            timer:1700,

                            showConfirmButton:false

                        });

                        this.videoSeleccionado = null;

                        this.videoEditando = null;

                        this.modoEdicion = false;

                        this.cargarVideos();

                        this.refrescarVista();

                    },

                    error:(error:any)=>{

                        console.error(error);

                        Swal.fire({

                            icon:'error',

                            title:'Error',

                            text:

                                error.error?.detail ||

                                'No fue posible eliminar el video.'

                        });

                    }

                });

        });

    }

    //======================================
    // COMPETENCIAS
    //======================================

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

    //======================================
    // SUBMÓDULOS
    //======================================

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

    //======================================
    // TEMAS
    //======================================

    cargarTemas():void{

        this.catalogosService

            .obtenerTemas()

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

    //======================================
    // FILTRAR
    //======================================

    filtrarVideos():void{

        this.videosFiltrados =

            this.videos.filter(video=>{

                return(

                    (!this.competenciaSeleccionada ||

                        video.id_competencia===

                        this.competenciaSeleccionada)

                    &&

                    (!this.submoduloSeleccionado ||

                        video.id_submodulo===

                        this.submoduloSeleccionado)

                    &&

                    (!this.temaSeleccionado ||

                        video.id_tema===

                        this.temaSeleccionado)

                );

            });

        this.paginaActual = 1;

        this.refrescarVista();

    }

    //======================================
    // LIMPIAR FILTROS
    //======================================

    limpiarFiltros():void{

        this.competenciaSeleccionada = null;

        this.submoduloSeleccionado = null;

        this.temaSeleccionado = null;

        this.videosFiltrados = [

            ...this.videos

        ];

        this.paginaActual = 1;

        this.refrescarVista();

    }

}
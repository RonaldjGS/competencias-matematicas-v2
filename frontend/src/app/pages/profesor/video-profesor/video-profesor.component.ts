import {

  Component,

  OnInit,

  ChangeDetectorRef,

} from '@angular/core';

import {

  CommonModule

} from '@angular/common';

import {

  VideoProfesorService

} from '../../../services/video-profesor.service';

import {

  SidebarProfesorComponent

} from '../../../components/sidebar-profesor/sidebar-profesor.component';

import {

  TopbarProfesorComponent

} from '../../../components/topbar-profesor/topbar-profesor.component';

import {

  CatalogosService

} from '../../../services/catalogos.service';

import {

    FormsModule

} from '@angular/forms';

@Component({

  selector: 'app-video-profesor',

  standalone: true,

  imports: [

    CommonModule,

    SidebarProfesorComponent,

    TopbarProfesorComponent,

    FormsModule

  ],

  templateUrl: './video-profesor.component.html',

  styleUrl: './video-profesor.component.css'

})

export class VideoProfesorComponent implements OnInit {

    resumen: any = {};

    videos: any[] = [];

    videosFiltrados:any[]=[];

    competencias:any[]=[];

    submodulos:any[]=[];

    temas:any[]=[];

    competenciaSeleccionada: number | null = null;

    submoduloSeleccionado: number | null = null;

    temaSeleccionado: number | null = null;

    tipoSeleccionado = '';

    estadoSeleccionado = '';

    videoSeleccionado: any = null;

    cargando = false;

    menuAbierto=false;

    modoEdicion = false;

    // ==========================================
    // MODAL NUEVO VIDEO
    // ==========================================

    mostrarModal = false;

    nuevoVideo = {

        titulo: '',

        descripcion: '',

        id_competencia: null,

        id_submodulo: null,

        id_tema: null,

        tipo: 'REFUERZO',

        youtube_url: '',

        estado: true

    };

    thumbnailPreview = '';

    // ==========================================
    // PAGINACIÓN
    // ==========================================

    paginaActual = 1;

    videosPorPagina = 6;

    totalPaginas = 1;

    videosPagina: any[] = [];

    constructor(

        private videoService: VideoProfesorService,

        private cdr:ChangeDetectorRef,

        private catalogosService: CatalogosService

    ) { }

    ngOnInit(): void {

        this.cargarResumen();

        this.cargarVideos();

        this.refrescarVista();

        this.cargarCompetencias();

        this.cargarSubmodulos();

        this.cargarTemas();

    }

    cargarResumen(): void {

        this.videoService

            .getResumen()

            .subscribe({

                next: (respuesta) => {

                    this.resumen = respuesta;

                    this.refrescarVista();

                },

                error: (error) => {

                console.error(error);

                }

            });

    }

    cargarVideos(): void {

        this.cargando = true;

        this.videoService

            .getVideos()

            .subscribe({

                next: (respuesta) => {

                    this.videos = respuesta;

                    this.aplicarFiltros();

                    this.cargando = false;

                    this.refrescarVista();

                },

                error: (error) => {

                console.error(error);

                this.cargando = false;

                }

            });

    }

    seleccionarVideo(

        idVideo: number

        ): void {

        this.videoService

            .getVideo(

                idVideo

            )

            .subscribe({

                next: (respuesta) => {

                    this.videoSeleccionado = respuesta;

                    this.refrescarVista();

                },

                error: (error) => {

                    console.error(error);

                }

            });

    }

    toggleMenu(){

        this.menuAbierto=

        !this.menuAbierto;

    }

    private refrescarVista():void{

        this.cdr.detectChanges();

    }

    cargarCompetencias(): void {

        this.catalogosService

        .obtenerCompetencias()

        .subscribe({

        next: (data: any) => {

            this.competencias = data;

            this.refrescarVista();

        },

        error: (error: any) => {

            console.error(

            'Error cargando competencias',

            error

            );

        }

        });

    }

    cargarSubmodulos(): void {

        this.catalogosService

            .obtenerSubmodulos()

            .subscribe({

            next: (data: any) => {

                this.submodulos = data;

                this.refrescarVista();

            },

            error: (error: any) => {

                console.error(

                'Error cargando submódulos',

                error

                );

            }

            });

    }

    cargarTemas(): void {

        const idNivel = localStorage.getItem(

            'id_nivel'

        );

        if (!idNivel) {

            console.error(

                'No existe id_nivel en localStorage'

            );

            return;

        }

        this.catalogosService

            .obtenerTemasPorNivel(

                Number(idNivel)

            )

            .subscribe({

            next: (data: any) => {

                this.temas = data;

                this.refrescarVista();

            },

            error: (error: any) => {

                console.error(

                'Error cargando temas',

                error

                );

            }

            });

    }

    activarEdicion(): void {

        if (!this.modoEdicion) {

            this.modoEdicion = true;

            return;

        }

        this.guardarCambios();

    }

    guardarCambios(): void {

        if (!this.videoSeleccionado) {

            return;

        }

        const datos = {

            titulo: this.videoSeleccionado.titulo,

            descripcion: this.videoSeleccionado.descripcion,

            id_competencia: this.videoSeleccionado.id_competencia,

            id_submodulo: this.videoSeleccionado.id_submodulo,

            id_tema: this.videoSeleccionado.id_tema,

            youtube_url:

            `https://www.youtube.com/watch?v=${this.videoSeleccionado.youtube_id}`,

            tipo: this.videoSeleccionado.tipo,

            actualizado_por: Number(

            localStorage.getItem(

                'id_profesor'

            )

            )

        };

        this.videoService

            .actualizarVideo(

            this.videoSeleccionado.id_video,

            datos

            )

            .subscribe({

            next: () => {

                this.modoEdicion = false;

                this.cargarVideos();

                this.seleccionarVideo(

                this.videoSeleccionado.id_video

                );

            },

            error: (error) => {

                console.error(error);

            }

            });

        }

    
        cambiarEstadoVideo():void{

            if(!this.videoSeleccionado){

                return;

            }

            this.videoService

                .actualizarEstado(

                    this.videoSeleccionado.id_video

                )

                .subscribe({

                    next:()=>{

                        this.cargarVideos();

                        this.seleccionarVideo(

                            this.videoSeleccionado.id_video

                        );

                    },

                    error:(error)=>{

                        console.error(error);

                    }

                });

        }

        abrirModal(): void {

            this.mostrarModal = true;

        }

        cerrarModal(): void {

            this.mostrarModal = false;

            this.thumbnailPreview = '';

            this.nuevoVideo = {

                titulo: '',

                descripcion: '',

                id_competencia: null,

                id_submodulo: null,

                id_tema: null,

                tipo: 'REFUERZO',

                youtube_url: '',

                estado: true

            };

        }

        actualizarPreview(): void {

            const url = this.nuevoVideo.youtube_url;

            const resultado =

                url.match(

                    /(?:v=|\/)([0-9A-Za-z_-]{11})/

                );

            if(resultado){

                this.thumbnailPreview =

                    `https://img.youtube.com/vi/${resultado[1]}/hqdefault.jpg`;

            }

            else{

                this.thumbnailPreview='';

            }

        }

        guardarVideo(): void {

            if (

                !this.nuevoVideo.titulo ||

                !this.nuevoVideo.id_competencia ||

                !this.nuevoVideo.id_submodulo ||

                !this.nuevoVideo.id_tema ||

                !this.nuevoVideo.youtube_url ||

                !this.nuevoVideo.tipo

            ) {

                alert(

                    'Debe completar todos los campos obligatorios.'

                );

                return;

            }

            const datos = {

                ...this.nuevoVideo,

                actualizado_por: Number(

                    localStorage.getItem(

                        'id_profesor'

                    )

                )

            };

            this.videoService

                .crearVideo(

                    datos

                )

                .subscribe({

                    next: (respuesta:any)=>{

                        alert(

                            respuesta.mensaje

                        );

                        this.cerrarModal();
                        
                        this.refrescarVista();

                        this.cargarVideos();

                        this.cargarResumen();

                    },

                    error:(error)=>{

                        console.error(error);

                        alert(

                            error.error.detail ||

                            'Error al registrar el video.'

                        );

                    }

                });

        }

        aplicarFiltros(): void {

            this.videosFiltrados = this.videos.filter(video => {


                const competencia =

                    !this.competenciaSeleccionada ||

                    video.id_competencia ===

                    this.competenciaSeleccionada;

                const submodulo =

                    !this.submoduloSeleccionado ||

                    video.id_submodulo ===

                    this.submoduloSeleccionado;

                const tema =

                    !this.temaSeleccionado ||

                    video.id_tema ===

                    this.temaSeleccionado;

                const tipo =

                    !this.tipoSeleccionado ||

                    this.tipoSeleccionado === 'Todos' ||

                    video.tipo ===

                    this.tipoSeleccionado;

                const estado =

                    !this.estadoSeleccionado ||

                    this.estadoSeleccionado === 'Todos' ||

                    video.estado ===

                    this.estadoSeleccionado;

                return (

                    competencia &&

                    submodulo &&

                    tema &&

                    tipo &&

                    estado

                );

            });

            this.paginaActual = 1;

            this.actualizarPaginacion();

            this.refrescarVista();

        }

        actualizarPaginacion(): void {

            this.totalPaginas = Math.ceil(

                this.videosFiltrados.length /

                this.videosPorPagina

            );

            this.refrescarVista();

            const inicio =

                (this.paginaActual - 1)

                * this.videosPorPagina;

            this.videosPagina =

                this.videosFiltrados.slice(

                    inicio,

                    inicio + this.videosPorPagina

                );

        }

}
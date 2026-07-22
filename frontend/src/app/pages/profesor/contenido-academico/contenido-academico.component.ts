import {

    Component,

    ChangeDetectorRef,

    OnInit

} from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HttpErrorResponse } from '@angular/common/http';

import {

    CommonModule

} from '@angular/common';

import {

    FormsModule

} from '@angular/forms';

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

    ContenidoAcademicoService

} from '../../../services/contenido-academico.service';

import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';

@Component({

    selector:'app-contenido-academico',

    standalone:true,

    imports:[

        CommonModule,

        FormsModule,

        SidebarProfesorComponent,

        TopbarProfesorComponent

    ],

    templateUrl:'./contenido-academico.component.html',

    styleUrl:'./contenido-academico.component.css'

})

export class ContenidoAcademicoComponent implements OnInit{

    nombreProfesor='';
    
    //==========================================
    // SIDEBAR
    //==========================================

    menuAbierto=false;

    //==========================================
    // CATÁLOGOS
    //==========================================

    competencias:any[] = [];

    submodulos:any[] = [];

    temas:any[] = [];

    tiposContenido:any[] = [];

    //==========================================
    // FILTROS
    //==========================================

    filtroCompetencia:number | null = null;

    filtroSubmodulo:number | null = null;

    filtroTema:number | null = null;

    filtroTipo:number | null = null;

    //==========================================
    // CONTENIDOS
    //==========================================

    contenidos:any[] = [];

    contenidosFiltrados:any[] = [];

    contenidoSeleccionado:any = null;

    contenidoEditando:any = null;

    //==========================================
    // PESTAÑA ACTIVA
    //==========================================

    pestanaActiva = 'PDF';

    //==========================================
    // MODAL
    //==========================================

    mostrarModal = false;

    //==========================================
    // MODO EDICIÓN
    //==========================================

    modoEdicion = false;

    //==========================================
    // NUEVO CONTENIDO
    //==========================================

    nuevoContenido = {

        id_competencia:null,

        id_submodulo:null,

        id_tema:null,

        id_tipo_contenido:null,

        nombre_contenido:'',

        descripcion_contenido:''

    };

    archivoSeleccionado:File | null = null;

    //==========================================
    // PAGINACIÓN
    //==========================================

    paginaActual = 1;

    registrosPorPagina = 8;

    urlVistaPrevia!: SafeResourceUrl;

    //==========================================
    // CONSTRUCTOR
    //==========================================

    constructor(

        private contenidoService:ContenidoAcademicoService,

        private catalogosService:CatalogosService,

        private sanitizer: DomSanitizer,

        private cdr:ChangeDetectorRef

    ){}

    //==========================================
    // INICIO
    //==========================================

    ngOnInit():void{

        this.nombreProfesor =

            localStorage.getItem(

                'nombre_profesor'

            ) || 'Profesor';

        this.cargarCompetencias();

        this.cargarTiposContenido();

        this.cargarContenidos();

    }

    //==========================================
    // REFRESCAR VISTA
    //==========================================

    refrescarVista():void{

        this.cdr.detectChanges();

    }

    //==========================================
    // CERRAR PANEL DETALLE
    //==========================================

    cerrarDetalle():void{

        this.contenidoSeleccionado = null;

        this.contenidoEditando = null;

        this.modoEdicion = false;

        this.urlVistaPrevia = null as any;

    }

    //==========================================
    // COMPETENCIAS
    //==========================================

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

    //==========================================
    // TIPOS DE CONTENIDO
    //==========================================

    cargarTiposContenido():void{

        this.catalogosService

            .obtenerTiposContenido()

            .subscribe({

                next:(resp:any)=>{

                    this.tiposContenido = resp;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    //==========================================
    // CONTENIDOS
    //==========================================

    cargarContenidos():void{

        this.cerrarDetalle();

        this.contenidoService

            .obtenerContenidos()

            .subscribe({

                next:(resp:any)=>{

                    this.contenidos = resp;

                    this.filtrarPorPestana();

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    //==========================================
    // SELECCIONAR PESTAÑA
    //==========================================

    seleccionarPestana(

        tipo:string

    ):void{

        this.cerrarDetalle();

        this.pestanaActiva = tipo;

        this.paginaActual = 1;

        this.filtrarPorPestana();

    }

    //==========================================
    // FILTRAR POR PESTAÑA
    //==========================================

    filtrarPorPestana():void{

        this.paginaActual = 1;

        this.contenidosFiltrados =

            this.contenidos.filter(

                contenido =>

                    contenido.tipo_contenido

                    .toUpperCase()

                    ===

                    this.pestanaActiva

            );

        this.refrescarVista();

    }

    //==========================================
    // CAMBIÓ COMPETENCIA
    //==========================================

    cambioCompetencia():void{

        this.filtroSubmodulo = null;

        this.filtroTema = null;

        this.temas = [];

        this.catalogosService

            .obtenerSubmodulos()

            .subscribe({

                next:(resp:any)=>{

                    this.submodulos = resp;

                    this.refrescarVista();

                }

            });

    }

    //==========================================
    // CAMBIÓ SUBMÓDULO
    //==========================================

    cambioSubmodulo():void{

        this.filtroTema = null;

        this.temas = [];

        if(!this.filtroSubmodulo){

            return;

        }

        this.catalogosService

            .obtenerTemasProfesor()

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

    //==========================================
    // BUSCAR CONTENIDOS
    //==========================================

    buscarContenidos():void{

        this.cerrarDetalle();

        this.cambiarPestanaDesdeFiltro();

        this.contenidosFiltrados =

            this.contenidos.filter(

                contenido =>{

                    const tipo =

                        contenido.tipo_contenido

                        .toUpperCase()

                        ===

                        this.pestanaActiva;

                    const competencia =

                        !this.filtroCompetencia ||

                        contenido.id_competencia

                        ==

                        this.filtroCompetencia;

                    const submodulo =

                        !this.filtroSubmodulo ||

                        contenido.id_submodulo

                        ==

                        this.filtroSubmodulo;

                    const tema =

                        !this.filtroTema ||

                        contenido.id_tema

                        ==

                        this.filtroTema;

                    return (

                        tipo &&

                        competencia &&

                        submodulo &&

                        tema

                    );

                }

            );

        this.paginaActual = 1;

        this.refrescarVista();

    }

    //==========================================
    // LIMPIAR FILTROS
    //==========================================

    limpiarFiltros():void{

        this.cerrarDetalle();

        this.filtroCompetencia = null;

        this.filtroSubmodulo = null;

        this.filtroTema = null;

        this.submodulos = [];

        this.temas = [];

        this.filtrarPorPestana();

    }

    //==========================================
    // SELECCIONAR CONTENIDO
    //==========================================

    seleccionarContenido(contenido:any):void{

        this.contenidoService

            .obtenerContenido(

                contenido.id_contenido

            )

            .subscribe({

                next:(resp:any)=>{

                    this.contenidoSeleccionado = resp;

                    const url =
                        `${environment.apiUrl}/uploads/contenido_academico/${resp.archivo}`;

                    this.urlVistaPrevia =

                        this.sanitizer.bypassSecurityTrustResourceUrl(

                            url

                        );

                    this.modoEdicion = false;

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    //==========================================
    // ACTIVAR EDICIÓN
    //==========================================

    activarEdicion():void{

        if(!this.contenidoSeleccionado){

            return;

        }

        this.contenidoEditando = {

            ...this.contenidoSeleccionado

        };

        this.cambioCompetenciaEditar();

        this.cambioSubmoduloEditar();

        this.modoEdicion = true;

    }

    //==========================================
    // CANCELAR EDICIÓN
    //==========================================

    cancelarEdicion():void{

        this.modoEdicion = false;

        this.contenidoEditando = null;

    }

    //==========================================
    // CAMBIO COMPETENCIA EDICIÓN
    //==========================================

    cambioCompetenciaEditar():void{

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

    //==========================================
    // CAMBIO SUBMÓDULO EDICIÓN
    //==========================================

    cambioSubmoduloEditar():void{

        this.catalogosService

            .obtenerTemasProfesor()

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

    //==========================================
    // GUARDAR EDICIÓN
    //==========================================

    guardarEdicion():void{

        this.contenidoService

            .actualizarContenido(

                this.contenidoEditando.id_contenido,

                this.contenidoEditando

            )

            .subscribe({

                next:()=>{

                    Swal.fire({

                        icon:'success',

                        title:'Contenido actualizado',

                        text:'Los cambios fueron guardados correctamente.',

                        confirmButtonColor:'#6f42c1'

                    });

                    this.modoEdicion = false;

                    this.contenidoEditando = null;

                    this.cargarContenidos();

                    this.seleccionarContenido({

                        id_contenido:

                        this.contenidoSeleccionado.id_contenido

                    });

                },

                error:(error:any)=>{

                    console.error(error);

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:

                            error.error?.detail ??

                            'No fue posible actualizar el contenido.',

                        confirmButtonColor:'#6f42c1'

                    });

                }

            });

    }

    //==========================================
    // CAMBIAR ESTADO
    //==========================================

    cambiarEstado():void{

        Swal.fire({

            title:'¿Desea cambiar el estado del contenido?',

            text:'El contenido cambiará entre Activo e Inactivo.',

            icon:'question',

            showCancelButton:true,

            confirmButtonText:'Sí',

            cancelButtonText:'Cancelar',

            confirmButtonColor:'#6f42c1'

        }).then((resultado)=>{

            if(!resultado.isConfirmed){

                return;

            }

            this.contenidoService

                .cambiarEstado(

                    this.contenidoSeleccionado.id_contenido

                )

                .subscribe({

                    next:()=>{

                        Swal.fire({

                            icon:'success',

                            title:'Estado actualizado',

                            text:'El estado del contenido fue actualizado correctamente.',

                            confirmButtonColor:'#6f42c1'

                        });

                        this.cargarContenidos();

                        this.seleccionarContenido({

                            id_contenido:

                            this.contenidoSeleccionado.id_contenido

                        });

                    },

                    error:(error:any)=>{

                        console.error(error);

                        Swal.fire({

                            icon:'error',

                            title:'Error',

                            text:

                                error.error?.detail ??

                                'No fue posible cambiar el estado.',

                            confirmButtonColor:'#6f42c1'

                        });

                    }

                });

        });

    }

    descargarContenido():void{

        if(!this.contenidoSeleccionado){

            return;

        }

        const enlace =

            document.createElement('a');

        enlace.href =
            `${environment.apiUrl}/uploads/contenido_academico/${this.contenidoSeleccionado.archivo}`;

        enlace.download =

            this.contenidoSeleccionado.nombre_contenido;

        enlace.click();

    }

    eliminarContenido():void{

        Swal.fire({

            title:'¿Eliminar contenido?',

            text:'Esta acción no se puede deshacer.',

            icon:'warning',

            showCancelButton:true,

            confirmButtonColor:'#dc3545',

            cancelButtonColor:'#6f42c1',

            confirmButtonText:'Eliminar',

            cancelButtonText:'Cancelar'

        }).then((resultado)=>{

            if(!resultado.isConfirmed){

                return;

            }

            this.contenidoService

                .eliminarContenido(

                    this.contenidoSeleccionado.id_contenido

                )

                .subscribe({

                    next:()=>{

                        Swal.fire({

                            icon:'success',

                            title:'Contenido eliminado',

                            text:'El contenido fue eliminado correctamente.',

                            confirmButtonColor:'#6f42c1'

                        });

                        this.cerrarDetalle();

                        this.cargarContenidos();

                    },

                    error:(error:any)=>{

                        console.error(error);

                        Swal.fire({

                            icon:'error',

                            title:'Error',

                            text:

                                error.error?.detail ??

                                'No fue posible eliminar el contenido.',

                            confirmButtonColor:'#6f42c1'

                        });

                    }

                });

        });

    }

    toggleMenu(){

        this.menuAbierto=

        !this.menuAbierto;

    }

    abrirModal(){

        this.nuevoContenido={

            id_competencia:null,

            id_submodulo:null,

            id_tema:null,

            id_tipo_contenido:null,

            nombre_contenido:'',

            descripcion_contenido:''

        };

        this.archivoSeleccionado=null;

        this.mostrarModal=true;

    }

    cerrarModal(){

        this.mostrarModal=false;

    }

    seleccionarArchivo(event:any){

        if(

            event.target.files.length>0

        ){

            this.archivoSeleccionado=

                event.target.files[0];

        }

    }

    guardarContenido(){

        if(!this.archivoSeleccionado){

            Swal.fire({

                icon:'warning',

                title:'Archivo requerido',

                text:'Debe seleccionar un archivo.',

                confirmButtonColor:'#6f42c1'

            });

            return;

        }

        const formData = new FormData();

        formData.append(

            'id_competencia',

            String(
                this.nuevoContenido.id_competencia
            )

        );

        formData.append(

            'id_submodulo',

            String(
                this.nuevoContenido.id_submodulo
            )

        );

        formData.append(

            'id_tema',

            String(
                this.nuevoContenido.id_tema
            )

        );

        formData.append(

            'id_tipo_contenido',

            String(
                this.nuevoContenido.id_tipo_contenido
            )

        );

        formData.append(

            'nombre_contenido',

            this.nuevoContenido.nombre_contenido

        );

        formData.append(

            'descripcion_contenido',

            this.nuevoContenido.descripcion_contenido ?? ''

        );

        formData.append(

            'archivo',

            this.archivoSeleccionado

        );

        this.contenidoService

            .crearContenido(formData)

            .subscribe({

                next:()=>{

                    this.cerrarModal();

                    this.cargarContenidos();

                    setTimeout(()=>{

                    Swal.fire({

                        icon:'success',

                        title:'Contenido registrado',

                        text:'El contenido académico fue registrado correctamente.',

                        confirmButtonColor:'#6f42c1'

                    });

                    },200);

                    this.refrescarVista();

                },

                error:(error:HttpErrorResponse)=>{

                    console.error(error);

                    Swal.fire({

                        icon:'error',

                        title:'Error',

                        text:

                            error.error?.detail ??

                            'Ocurrió un error al registrar el contenido.',

                        confirmButtonColor:'#6f42c1'

                    });

                }

            });

    }

    //==========================================
    // COMPETENCIA MODAL
    //==========================================

    cambioCompetenciaModal():void{

        this.nuevoContenido.id_submodulo = null;

        this.nuevoContenido.id_tema = null;

        this.submodulos = [];

        this.temas = [];

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

    //==========================================
    // SUBMODULO MODAL
    //==========================================

    cambioSubmoduloModal():void{

        this.nuevoContenido.id_tema = null;

        this.temas = [];

        this.catalogosService

            .obtenerTemasProfesor()

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

    get contenidosPaginados(){

        const inicio =

            (this.paginaActual-1)

            *

            this.registrosPorPagina;

        return this.contenidosFiltrados.slice(

            inicio,

            inicio+

            this.registrosPorPagina

        );

    }

    get totalPaginas(){

        return Math.max(

            1,

            Math.ceil(

                this.contenidosFiltrados.length/

                this.registrosPorPagina

            )

        );

    }

    get registroInicial():number{

        if(this.contenidosFiltrados.length===0){

            return 0;

        }

        return (

            (this.paginaActual-1)

            *

            this.registrosPorPagina

        )+1;

    }

    get registroFinal():number{

        return Math.min(

            this.paginaActual*

            this.registrosPorPagina,

            this.contenidosFiltrados.length

        );

    }

    obtenerCantidadPorTipo(

        tipo:string

    ):number{

        return this.contenidos.filter(

            contenido=>

                contenido.tipo_contenido

                ?.toUpperCase()

                ===

                tipo.toUpperCase()

        ).length;

    }

    paginaSiguiente(){

        if(

            this.paginaActual<

            this.totalPaginas

        ){

            this.paginaActual++;

        }

    }

    paginaAnterior(){

        if(

            this.paginaActual>1

        ){

            this.paginaActual--;

        }

    }

    esImagen():boolean{

        return this.contenidoSeleccionado?.tipo_contenido === 'IMAGEN';

    }

    esPdf():boolean{

        return (

            this.contenidoSeleccionado?.tipo_contenido === 'PDF'

            ||

            this.contenidoSeleccionado?.tipo_contenido === 'ARTICULO'

        );

    }

    //==========================================
    // PREPARAR EDICIÓN
    //==========================================

    prepararEdicion():void{

        this.cambioCompetenciaEditar();

        this.cambioSubmoduloEditar();

    }

    private cambiarPestanaDesdeFiltro():void{

        if(!this.filtroTipo){

            return;

        }

        const tipo =

            this.tiposContenido.find(

                t =>

                t.id_tipo_contenido ==

                this.filtroTipo

            );

        if(tipo){

            this.pestanaActiva =

                tipo.nombre_tipo.toUpperCase();

        }

    }

}

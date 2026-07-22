import {

    Component,

    ChangeDetectorRef,

    OnInit

} from '@angular/core';

import {

    CommonModule

} from '@angular/common';

import {

    FormsModule

} from '@angular/forms';

import {

    SidebarEstudianteComponent

} from '../../../components/sidebar-estudiante/sidebar-estudiante.component';

import {

    TopbarEstudianteComponent

} from '../../../components/topbar-estudiante/topbar-estudiante.component';

import {

    CatalogosService

} from '../../../services/catalogos.service';

import {

    ContenidoAcademicoService

} from '../../../services/contenido-academico.service';

import { environment } from '../../../../environments/environment';

@Component({

    selector:'app-contenido-academico-estudiante',

    standalone:true,

    imports:[

        CommonModule,

        FormsModule,

        SidebarEstudianteComponent,

        TopbarEstudianteComponent

    ],

    templateUrl:'./contenido-academico-estudiante.component.html',

    styleUrl:'./contenido-academico-estudiante.component.css'

})

export class ContenidoAcademicoEstudianteComponent implements OnInit{

    nombreEstudiante='';

    menuAbierto=false;

    competencias:any[]=[];

    submodulos:any[]=[];

    temas:any[]=[];

    tiposContenido:any[]=[];

    filtroCompetencia:number|null=null;

    filtroSubmodulo:number|null=null;

    filtroTema:number|null=null;

    filtroTipo:number|null=null;

    pestanaActiva='PDF';

    paginaActual=1;

    registrosPorPagina=8;

    urlVistaPrevia='';
    
    contenidoSeleccionado:any = null;

    contenidosFiltrados:any[] = [];

    contenidos:any[] = [];

    constructor(

        private contenidoService:ContenidoAcademicoService,

        private catalogosService:CatalogosService,

        private cdr:ChangeDetectorRef

    ){}

    ngOnInit():void{

        this.nombreEstudiante =

        localStorage.getItem(

            'nombre_estudiante'

        ) || 'Estudiante';

        this.cargarCompetencias();

        this.cargarTiposContenido();

        this.cargarContenidos();

    }

    refrescarVista():void{

        this.cdr.detectChanges();

    }

    cerrarDetalle():void{

        this.contenidoSeleccionado = null;

        this.urlVistaPrevia = '';

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

    cargarContenidos():void{

        this.cerrarDetalle();

        this.contenidoService

            .obtenerContenidosEstudiante()

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

    seleccionarPestana(

        tipo:string

    ):void{

        this.cerrarDetalle();

        this.pestanaActiva = tipo;

        this.paginaActual = 1;

        this.filtrarPorPestana();

    }

    filtrarPorPestana():void{

        this.paginaActual = 1;

        this.contenidosFiltrados =

            this.contenidos.filter(

                contenido=>

                    contenido.tipo_contenido

                    .toUpperCase()

                    ===

                    this.pestanaActiva

            );

        this.refrescarVista();

    }

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

    cambioSubmodulo():void{

        this.filtroTema = null;

        this.temas = [];

        if(!this.filtroSubmodulo){

            return;

        }

        this.catalogosService

            .obtenerTemasEstudiante()

            .subscribe({

                next:(resp:any)=>{

                    this.temas = resp;

                    this.refrescarVista();

                }

            });

    }

    buscarContenidos():void{

        this.cerrarDetalle();

        this.cambiarPestanaDesdeFiltro();

        this.contenidosFiltrados =

            this.contenidos.filter(

                contenido=>{

                    const tipo=

                        contenido.tipo_contenido

                        .toUpperCase()

                        ===

                        this.pestanaActiva;

                    const competencia=

                        !this.filtroCompetencia ||

                        contenido.id_competencia==

                        this.filtroCompetencia;

                    const submodulo=

                        !this.filtroSubmodulo ||

                        contenido.id_submodulo==

                        this.filtroSubmodulo;

                    const tema=

                        !this.filtroTema ||

                        contenido.id_tema==

                        this.filtroTema;

                    return(

                        tipo &&

                        competencia &&

                        submodulo &&

                        tema

                    );

                }

            );

        this.paginaActual=1;

    }

    limpiarFiltros():void{

        this.cerrarDetalle();

        this.filtroCompetencia=null;

        this.filtroSubmodulo=null;

        this.filtroTema=null;

        this.submodulos=[];

        this.temas=[];

        this.filtrarPorPestana();

    }

    seleccionarContenido(

        contenido:any

    ):void{

        this.contenidoService

            .obtenerContenido(

                contenido.id_contenido

            )

            .subscribe({

                next:(resp:any)=>{

                    this.contenidoSeleccionado=resp;

                    this.urlVistaPrevia =
                        `${environment.apiUrl}/uploads/contenido_academico/${resp.archivo}`;

                    this.refrescarVista();

                }

            });

    }

    descargarContenido():void{

        if(!this.contenidoSeleccionado){

            return;

        }

        const enlace=

            document.createElement('a');

        enlace.href =
            `${environment.apiUrl}/uploads/contenido_academico/${this.contenidoSeleccionado.archivo}`;

        enlace.download=

            this.contenidoSeleccionado.nombre_contenido;

        enlace.click();

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

    toggleMenu(){

        this.menuAbierto=

        !this.menuAbierto;

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
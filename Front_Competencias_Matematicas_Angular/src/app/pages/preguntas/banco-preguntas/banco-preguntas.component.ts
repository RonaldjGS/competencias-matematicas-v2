import { Component } from '@angular/core';

import {
    FormsModule
} from '@angular/forms';

import {
    CommonModule
} from '@angular/common';

import {
    PreguntasService
} from '../../../services/preguntas.service';

import {
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import {

    CatalogosService

} from '../../../services/catalogos.service';

@Component({

    selector:'app-banco-preguntas',

    standalone:true,

    imports:[

        CommonModule,

        FormsModule

    ],

    templateUrl:'./banco-preguntas.component.html',

    styleUrl:'./banco-preguntas.component.css'

})

export class BancoPreguntasComponent implements OnInit{

    preguntas:any[] = [];

    preguntaSeleccionada:any = null;

    modoEdicion = false;

    competencias:any[]=[];

    submodulos:any[]=[];

    temas:any[]=[];

    competenciaSeleccionada:number|null=null;

    submoduloSeleccionado:number|null=null;

    temaSeleccionado:number|null=null;

    preguntaEditando:any = null;

    paginaActual = 1;

    registrosPorPagina = 10;

    constructor(

        private preguntasService:
        PreguntasService,

        private cdr:ChangeDetectorRef,

        private catalogosService:
        CatalogosService

    ){}

    ngOnInit():void{

        this.cargarPreguntas();

        this.cargarCompetencias();

        this.cargarSubmodulos();

        this.cargarTemas();

    }

    seleccionarPregunta(
        pregunta:any
    ):void{

        this.preguntasService

            .obtenerPregunta(

                pregunta.id_pregunta

            )

            .subscribe({

                next:(resp:any)=>{

                    this.preguntaSeleccionada =

                        resp;

                    this.preguntaEditando = {

                        ...resp

                    };

                    this.modoEdicion = false;
                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                    alert(

                        'No fue posible obtener la información de la pregunta.'

                    );

                }

            });

    }
    //==========================================
    // EDITAR
    //==========================================

    editarPregunta():void{

        this.modoEdicion = true;
        this.refrescarVista();

    }

    //==========================================
    // CANCELAR
    //==========================================

    cancelarEdicion():void{

        this.preguntaEditando = {

            ...this.preguntaSeleccionada

        };

        this.modoEdicion = false;

        this.refrescarVista();

    }

    //==========================================
    // GUARDAR CAMBIOS
    //==========================================

    guardarCambios():void{

        if(

            !this.preguntaSeleccionada ||

            !this.preguntaEditando

        ){

            return;

        }

        this.preguntasService

            .actualizarPregunta(

                this.preguntaSeleccionada.id_pregunta,

                this.preguntaEditando

            )

            .subscribe({

                next:()=>{

                    alert(

                        'La pregunta fue actualizada correctamente.'

                    );

                    this.cargarPreguntas();

                    this.seleccionarPregunta({

                        id_pregunta:

                        this.preguntaSeleccionada.id_pregunta

                    });

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                    alert(

                        error.error?.detail ||

                        'No fue posible actualizar la pregunta.'

                    );

                }

            });

    }

    cargarPreguntas():void{

        this.preguntasService

            .obtenerMisPreguntas()

            .subscribe({

                next:(resp:any)=>{

                    this.preguntas = resp;

                    this.paginaActual = 1;

                    this.refrescarVista();

                },

            
                error:(error)=>{

                    console.error(error);

                }

            });

    }

    //==========================================
    // PREGUNTAS PAGINADAS
    //==========================================

    get preguntasPaginadas(){

        const inicio =

            (this.paginaActual - 1)

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

    cargarCompetencias():void{

        this.catalogosService

            .obtenerCompetencias()

            .subscribe({

                next:(resp:any)=>{

                    this.competencias = resp;
                    this.refrescarVista();

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

                }

            });

    }

    cargarTemas():void{

        const idNivel = Number(

            localStorage.getItem(

                'id_nivel'

            )

        );

        this.catalogosService

            .obtenerTemasPorNivel(

                idNivel

            )

            .subscribe({

                next:(resp:any)=>{

                    this.temas = resp;
                    this.refrescarVista();

                }

            });

    }

    buscar():void{

        this.preguntasService

            .buscarPreguntas(

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

    limpiarFiltros():void{

        this.competenciaSeleccionada = null;

        this.submoduloSeleccionado = null;

        this.temaSeleccionado = null;

        this.cargarPreguntas();

        this.refrescarVista();

    }

    //==========================================
    // CAMBIAR ESTADO
    //==========================================

    cambiarEstado():void{

        if(

            !this.preguntaSeleccionada

        ){

            return;

        }

        const accion =

            this.preguntaSeleccionada.estado

            ? 'desactivar'

            : 'activar';

        if(

            !confirm(

                `¿Está seguro de ${accion} esta pregunta?`

            )

        ){

            return;

        }

        this.preguntasService

            .cambiarEstadoPregunta(

                this.preguntaSeleccionada.id_pregunta

            )

            .subscribe({

                next:()=>{

                    alert(

                        `Pregunta ${accion}da correctamente.`

                    );

                    this.cargarPreguntas();

                    this.seleccionarPregunta({

                        id_pregunta:

                        this.preguntaSeleccionada.id_pregunta

                    });

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                    alert(

                        error.error?.detail ||

                        'No fue posible cambiar el estado.'

                    );

                }

            });

    }

    private refrescarVista():void{

        this.cdr.detectChanges();

    }

}
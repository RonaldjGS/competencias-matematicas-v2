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
    CatalogosService
} from '../../../services/catalogos.service';

import {

    ConfiguracionQuizService

} from '../../../services/configuracion-quiz.service';

@Component({

    selector:'app-configuracion-quiz',

    standalone:true,

    imports:[

        CommonModule,

        FormsModule

    ],

    templateUrl:'./configuracion-quiz.component.html',

    styleUrl:'./configuracion-quiz.component.css'

})

export class ConfiguracionQuizComponent
implements OnInit{

    competencias:any[]=[];

    submodulos:any[]=[];

    temas:any[]=[];

    dificultades=[

        'Básico',

        'Intermedio',

        'Avanzado'

    ];

    competenciaSeleccionada:number|null=null;

    submoduloSeleccionado:number|null=null;

    temaSeleccionado:number|null=null;

    dificultadSeleccionada:string|null=null;

    configuracion = {

        cantidad_preguntas:10,

        tiempo_minutos:20,

        intentos:1,

        mezclar_preguntas:true,

        mezclar_opciones:true,

        mostrar_resultado:true

    };

    idConfiguracion:number|null=null;

    mostrarConfiguracion = false;

    mostrarModalGuardar = false;

    esNuevaConfiguracion = true;

    constructor(

        private catalogosService:
        CatalogosService,

        private configuracionQuizService:
        ConfiguracionQuizService,

        private cdr:
        ChangeDetectorRef

    ){}

    ngOnInit():void{

        this.cargarCompetencias();

        this.cargarSubmodulos();

        this.cargarTemas();

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

    obtenerNombreCompetencia():string{

        const competencia = this.competencias.find(

            c=>c.id_competencia===this.competenciaSeleccionada

        );

        return competencia?.nombre_competencia || '-';

    }

    obtenerNombreSubmodulo():string{

        const submodulo = this.submodulos.find(

            s=>s.id_submodulo===this.submoduloSeleccionado

        );

        return submodulo?.nombre_submodulo || '-';

    }

    obtenerNombreTema():string{

        const tema = this.temas.find(

            t=>t.id_tema===this.temaSeleccionado

        );

        return tema?.nombre_tema || '-';

    }

    obtenerNombreDificultad():string{

        return this.dificultadSeleccionada || '-';

    }

    private refrescarVista():void{

        this.cdr.detectChanges();

    }

    verificarConfiguracion():void{

        this.mostrarConfiguracion =

            !!(

                this.competenciaSeleccionada &&

                this.submoduloSeleccionado &&

                this.temaSeleccionado &&

                this.dificultadSeleccionada

            );

        if(!this.mostrarConfiguracion){

            this.idConfiguracion = null;

            this.configuracion={

                cantidad_preguntas:10,

                tiempo_minutos:20,

                intentos:1,

                mezclar_preguntas:true,

                mezclar_opciones:true,

                mostrar_resultado:true

            };

            return;

        }

        this.obtenerConfiguracion();
        
        this.esNuevaConfiguracion = true;

    }

    obtenerConfiguracion():void{

        this.configuracionQuizService

            .obtenerConfiguracion(

                this.competenciaSeleccionada!,

                this.submoduloSeleccionado!,

                this.temaSeleccionado!,

                this.dificultadSeleccionada!

            )

            .subscribe({

                next:(resp:any)=>{

                    if(resp){

                        this.idConfiguracion =
                            resp.id_configuracion;

                        this.esNuevaConfiguracion = false;

                        this.configuracion={

                            cantidad_preguntas:

                            resp.cantidad_preguntas,

                            tiempo_minutos:

                            resp.tiempo_minutos,

                            intentos:

                            resp.intentos,

                            mezclar_preguntas:

                            resp.mezclar_preguntas,

                            mezclar_opciones:

                            resp.mezclar_opciones,

                            mostrar_resultado:

                            resp.mostrar_resultado

                        };

                    }

                    else{

                        this.idConfiguracion = null;

                        this.esNuevaConfiguracion = true;

                        this.configuracion={

                            cantidad_preguntas:10,

                            tiempo_minutos:20,

                            intentos:1,

                            mezclar_preguntas:true,

                            mezclar_opciones:true,

                            mostrar_resultado:true

                        };

                    }

                    this.refrescarVista();

                },

                error:(error:any)=>{

                    console.error(error);

                }

            });

    }

    abrirModalGuardar():void{

        this.mostrarModalGuardar = true;

    }

    cerrarModalGuardar():void{

        this.mostrarModalGuardar = false;

    }

    guardarConfiguracion():void{

        if(

            this.configuracion.intentos < 1 ||

            this.configuracion.intentos > 5

        ){

            alert(

                'El número de intentos debe estar entre 1 y 5.'

            );

            this.cerrarModalGuardar();

            return;

        }

        if(

            this.configuracion.cantidad_preguntas <= 0

        ){

            alert(

                'La cantidad de preguntas debe ser mayor que cero.'

            );

            this.cerrarModalGuardar();

            return;

        }

        if(

            this.configuracion.tiempo_minutos <= 0

        ){

            alert(

                'El tiempo debe ser mayor que cero.'

            );

            this.cerrarModalGuardar();

            return;

        }

        const data={

            id_competencia:
            this.competenciaSeleccionada,

            id_submodulo:
            this.submoduloSeleccionado,

            id_tema:
            this.temaSeleccionado,

            dificultad:
            this.dificultadSeleccionada,

            cantidad_preguntas:
            this.configuracion.cantidad_preguntas,

            tiempo_minutos:
            this.configuracion.tiempo_minutos,

            intentos:
            this.configuracion.intentos,

            mezclar_preguntas:
            this.configuracion.mezclar_preguntas,

            mezclar_opciones:
            this.configuracion.mezclar_opciones,

            mostrar_resultado:
            this.configuracion.mostrar_resultado

        };

        this.configuracionQuizService

            .guardarConfiguracion(

                data

            )

            .subscribe({

                next:(resp:any)=>{

                    this.cerrarModalGuardar();

                    this.idConfiguracion =

                        resp.id_configuracion;

                    alert(

                        'La configuración fue guardada correctamente.'

                    );

                    this.obtenerConfiguracion();

                },

                error:(error:any)=>{

                    console.error(error);

                    this.cerrarModalGuardar();

                    alert(

                        error.error?.detail ||

                        'No fue posible guardar la configuración.'

                    );

                }

            });

    }

    //==========================================
    // CANTIDAD PREGUNTAS
    //==========================================

    aumentarCantidadPreguntas():void{

        this.configuracion.cantidad_preguntas++;

    }

    disminuirCantidadPreguntas():void{

        if(this.configuracion.cantidad_preguntas>1){

            this.configuracion.cantidad_preguntas--;

        }

    }

    //==========================================
    // TIEMPO
    //==========================================

    aumentarTiempo():void{

        this.configuracion.tiempo_minutos++;

    }

    disminuirTiempo():void{

        if(this.configuracion.tiempo_minutos>1){

            this.configuracion.tiempo_minutos--;

        }

    }

    //==========================================
    // INTENTOS
    //==========================================

    aumentarIntentos():void{

        if(this.configuracion.intentos<5){

            this.configuracion.intentos++;

        }

    }

    disminuirIntentos():void{

        if(this.configuracion.intentos>1){

            this.configuracion.intentos--;

        }

    }

}
import {

    Component,

    OnInit,

    PLATFORM_ID,

    inject,

    ChangeDetectorRef,

} from '@angular/core';

import {

    CommonModule,

    isPlatformBrowser

} from '@angular/common';

import {

    ActivatedRoute,

    Router

} from '@angular/router';

import {

    TopbarProfesorComponent

} from '../../../components/topbar-profesor/topbar-profesor.component';

import {

    SidebarProfesorComponent

} from '../../../components/sidebar-profesor/sidebar-profesor.component';

import {

    EstudianteProfesorService

} from '../../../services/estudiante-profesor.service';

import {

    Chart

} from 'chart.js/auto';

import {

    CatalogosService

} from '../../../services/catalogos.service';

import {

    PdfExportService

} from '../../../services/pdf-export.service';

import { 

    ExcelExportService 

} from '../../../services/excel-export.service';

import {

    FormsModule

} from '@angular/forms';

@Component({

    selector:'app-perfil-estudiante-profesor',

    standalone:true,

    imports:[

        CommonModule,

        TopbarProfesorComponent,

        SidebarProfesorComponent,

        FormsModule,

    ],

    templateUrl:'./perfil-estudiante-profesor.component.html',

    styleUrl:'./perfil-estudiante-profesor.component.css'

})

export class PerfilEstudianteProfesorComponent implements OnInit{

    private platformId=

    inject(

    PLATFORM_ID

    );

    nombreProfesor='';

    menuAbierto=false;

    idEstudiante=0;

    pestana='perfil';

    perfil:any={

        id_estudiante:0,

        nombre:'',

        correo:'',

        estado:'',

        fecha_registro:'',

        tests_realizados:0,

        promedio_general:0,

        mejor_puntaje:0,

        tiempo_promedio:0,

        tiempo_promedio_segundos:0

    };

    graficoCompetencias!:Chart;

    datosCompetencias:any[]=[];

    graficoSubmodulos!:Chart;

    competencias:any[]=[];

    datosSubmodulos:any[]=[];

    submodulos:any[]=[];

    datosTemas:any[]=[];

    graficoTemas!:Chart;

    competenciaSubmodulo:number|null=null;

    competenciaTema:number|null=null;

    submoduloTema:number|null=null;

    recomendaciones:any[]=[];

    datosEvolucion:any[]=[];

    graficoEvolucion!:Chart;

    graficoDificultad!:Chart;

    datosDificultad:any[]=[];

    mostrarMenuExportar=false;

    historialEvaluaciones:any[]=[];

    evaluacionSeleccionada:number|null=null;

    detalleHistorial:any[]=[];

    comparacionCurso:any={

        promedio_estudiante:0,

        promedio_curso:0,

        diferencia:0,

        estado:'',

        mensaje:''

    };

    constructor(

        private route:ActivatedRoute,

        private router:Router,

        private estudianteProfesorService:

        EstudianteProfesorService,

        private cdr:ChangeDetectorRef,

        private catalogosService:CatalogosService,

        private pdfExportService:PdfExportService,

        private excelExportService:ExcelExportService

    ){}

    ngOnInit():void{

        if(

            isPlatformBrowser(

            this.platformId

            )

        ){

            this.nombreProfesor=

            localStorage.getItem(

            'nombre_profesor'

            ) || 'Profesor';

        }

        this.idEstudiante=

        Number(

            this.route.snapshot.paramMap.get(

            'id'

            )

        );

        this.cargarPerfil();

        this.cargarCompetencias();

        this.cargarCompetenciasFiltro();

        this.cargarComparacionCurso();

        this.cargarEvolucion();

        this.cargarPrecisionDificultad();

        this.cargarHistorialEvaluaciones();

    }

    irEstudiantes(){

        this.router.navigate([

            '/estudiante-profesor'

        ]);

    }

    mostrarPerfil():void{

        this.pestana='perfil';
        this.refrescarVista();

        setTimeout(() => {
            this.crearGraficoCompetencias();
            this.crearGraficoSubmodulos();
            this.crearGraficoTemas();
            this.crearGraficoEvolucion();
            this.crearGraficoDificultad();
            this.crearGraficoComparacionCurso();
        });

    }

    mostrarHistorial():void{

        this.pestana='historial';
        this.refrescarVista();

    }

    cargarPerfil():void{

        this.estudianteProfesorService

        .obtenerPerfilEstudiante(

            this.idEstudiante

        )

        .subscribe({

            next:(data:any)=>{

                this.perfil=data;
                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

    }

    private refrescarVista():void{

        this.cdr.detectChanges();

    }

    cargarCompetencias():void{

        this.estudianteProfesorService

        .obtenerRendimientoCompetencias(

            this.idEstudiante

        )

        .subscribe({

            next:(data:any)=>{

                this.datosCompetencias=data;

                this.crearGraficoCompetencias();

                this.refrescarVista();

                this.generarRecomendaciones();

            },

            error:(err)=>{

                console.error(err);

            }

        });

    }

    cargarCompetenciasFiltro():void{

        this.catalogosService

        .obtenerCompetencias()

        .subscribe({

            next:(data:any)=>{

                this.competencias=data;

                if(

                    this.competencias.length>0

                ){

                    this.competenciaSubmodulo=

                    this.competencias[0].id_competencia;

                    this.competenciaTema=

                    this.competencias[0].id_competencia;

                    this.cargarSubmodulos();

                    this.cargarFiltroSubmodulos();

                    this.refrescarVista();

                }

            }

        });

    }

    crearGraficoCompetencias():void{

        if(

            this.graficoCompetencias

        ){

            this.graficoCompetencias.destroy();

        }

        this.graficoCompetencias=

        new Chart(

            'graficoCompetenciasPerfil',

            {

                type:'bar',

                data:{

                    labels:

                    this.datosCompetencias.map(

                        (x:any)=>

                        x.competencia

                    ),

                    datasets:[

                        {

                            label:

                            'Precisión (%)',

                            data:

                            this.datosCompetencias.map(

                                (x:any)=>

                                x.promedio

                            ),

                            borderRadius:8,

                            backgroundColor:[

                                '#7c3aed',

                                '#8b5cf6',

                                '#a855f7',

                                '#c084fc'

                            ],

                            barThickness:60,

                            maxBarThickness:60,

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:false

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            max:100

                        }

                    },

                    layout:{

                        padding:{

                            left:15,

                            right:15,

                            top:10,

                            bottom:0

                        }

                    }

                }

            }

        );

    }

    cargarSubmodulos():void{

        if(

            this.competenciaSubmodulo==null

        ){

            return;

        }

        this.estudianteProfesorService

        .obtenerRendimientoSubmodulos(

            this.idEstudiante,

            this.competenciaSubmodulo

        )

        .subscribe({

            next:(data:any)=>{

                this.datosSubmodulos=data;

                this.crearGraficoSubmodulos();

                this.refrescarVista();

                this.generarRecomendaciones();

            }

        });

    }

    crearGraficoSubmodulos():void{

        if(

            this.graficoSubmodulos

        ){

            this.graficoSubmodulos.destroy();

        }

        this.graficoSubmodulos=

        new Chart(

            'graficoSubmodulos',

            {

                type:'bar',

                data:{

                    labels:

                    this.datosSubmodulos.map(

                        (x:any)=>x.submodulo

                    ),

                    datasets:[

                        {

                            data:

                            this.datosSubmodulos.map(

                                (x:any)=>x.promedio

                            ),

                            backgroundColor:'#8b5cf6',

                            borderRadius:8,

                            barThickness:35

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:false

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            max:100

                        }

                    }

                }

            }

        );

    }

    cargarFiltroSubmodulos():void{

        if(

            this.competenciaTema==null

        ){

            return;

        }

        this.estudianteProfesorService

        .obtenerSubmodulosFiltro(

            this.idEstudiante,

            this.competenciaTema

        )

        .subscribe({

            next:(data:any)=>{

                this.submodulos=data;

                if(

                    this.submodulos.length>0

                ){

                    this.submoduloTema=

                    this.submodulos[0].id_submodulo;

                    this.cargarTemas();

                    this.refrescarVista();

                }

            },

            error:(err)=>{

                console.error(err);

            }

        });

    }

    cargarTemas():void{

        if(

            this.competenciaTema==null ||

            this.submoduloTema==null

        ){

            return;

        }

        this.estudianteProfesorService

        .obtenerRendimientoTemas(

            this.idEstudiante,

            this.competenciaTema,

            this.submoduloTema

        )

        .subscribe({

            next:(data:any)=>{

                this.datosTemas=data;

                this.crearGraficoTemas();

                this.refrescarVista();

            }

        });

    }


    crearGraficoTemas():void{

        if(

            this.graficoTemas

        ){

            this.graficoTemas.destroy();

        }

        this.graficoTemas=

        new Chart(

            'graficoTemas',

            {

                type:'bar',

                data:{

                    labels:

                    this.datosTemas.map(

                        (x:any)=>

                        x.tema

                    ),

                    datasets:[

                        {

                            data:

                            this.datosTemas.map(

                                (x:any)=>

                                x.promedio

                            ),

                            backgroundColor:'#7c3aed',

                            borderRadius:8,

                            barThickness:20

                        }

                    ]

                },

                options:{

                    indexAxis:'y',

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:false

                        }

                    },

                    scales:{

                        x:{

                            beginAtZero:true,

                            max:100

                        }

                    }

                }

            }

        );

    }

    cargarComparacionCurso():void{

        this.estudianteProfesorService

        .obtenerComparacionCurso(

            this.idEstudiante

        )

        .subscribe({

            next:(data:any)=>{

                this.comparacionCurso=data;

                console.log(

                    'Comparación curso',

                    data

                );

                this.refrescarVista();

                this.generarRecomendaciones();

                this.crearGraficoComparacionCurso();

            },

            error:(error)=>{

                console.error(

                    error

                );

            }

        });

    }

    private generarRecomendaciones():void{

        this.recomendaciones=[];

        this.generarRecomendacionCompetencia();

        this.generarRecomendacionSubmodulo();

        this.generarRecomendacionTema();

        this.generarRecomendacionTiempo();

        //this.generarRecomendacionDificultad();

        if(this.comparacionCurso.diferencia>=10){

            this.recomendaciones.push({

                icono:'bi-graph-up-arrow',

                titulo:'Excelente rendimiento',

                descripcion:'Mantienes un desempeño superior al promedio del curso.'

            });

        }

        else if(this.comparacionCurso.diferencia>=0){

            this.recomendaciones.push({

                icono:'bi-check-circle',

                titulo:'Buen desempeño',

                descripcion:'Tu rendimiento es similar o ligeramente superior al promedio.'

            });

        }

        else{

            this.recomendaciones.push({

                icono:'bi-arrow-repeat',

                titulo:'Puedes mejorar',

                descripcion:'Practica con mayor frecuencia para superar el promedio del curso.'

            });

        }

        

    }

    private generarRecomendacionCompetencia():void{

        if(
            !this.datosCompetencias ||
            this.datosCompetencias.length===0
        )
        
        {
            return;
        }

        const peorCompetencia=this.datosCompetencias.reduce(

            (menor:any,actual:any)=>{

                return actual.promedio<menor.promedio
                    ?actual
                    :menor;

            }

        );

        this.recomendaciones.push({

            icono:'bi-book',

            titulo:'Competencia a reforzar',

            descripcion:
            `Se recomienda reforzar "${peorCompetencia.competencia}", ya que presenta el promedio más bajo (${peorCompetencia.promedio.toFixed(1)}%).`

        });

    }

    private generarRecomendacionSubmodulo():void{

        if(
            !this.datosSubmodulos ||
            this.datosSubmodulos.length===0
        ){
            return;
        }

        const peorSubmodulo=this.datosSubmodulos.reduce(

            (menor:any,actual:any)=>

                actual.promedio<menor.promedio
                    ?actual
                    :menor

        );

        this.recomendaciones.push({

            icono:'bi-journal-bookmark',

            titulo:'Submódulo a reforzar',

            descripcion:
            `Dedica más tiempo al submódulo "${peorSubmodulo.submodulo}", ya que presenta el promedio más bajo (${peorSubmodulo.promedio.toFixed(1)}%).`

        });

    }

    private generarRecomendacionTema():void{

        if(

            !this.datosTemas ||

            this.datosTemas.length===0

        ){

            return;

        }

        const peorTema=

        this.datosTemas.reduce(

            (a:any,b:any)=>

            a.promedio<b.promedio ? a : b

        );

        const mejorTema=

        this.datosTemas.reduce(

            (a:any,b:any)=>

            a.promedio>b.promedio ? a : b

        );

        if(

            peorTema.promedio<60

        ){

            this.recomendaciones.push({

                icono:'bi-book',

                titulo:'Refuerza un tema específico',

                descripcion:
                `Dedica más práctica al tema "${peorTema.tema}" (${peorTema.promedio.toFixed(1)}%).`

            });

        }

        if(

            mejorTema.promedio>=85

        ){

            this.recomendaciones.push({

                icono:'bi-award',

                titulo:'Tema dominado',

                descripcion:
                `"${mejorTema.tema}" es tu tema más sólido (${mejorTema.promedio.toFixed(1)}%). Continúa practicándolo para mantener ese nivel.`

            });

        }

    }

    private generarRecomendacionTiempo():void{

        if(

            !this.perfil

        ){

            return;

        }

        const tiempo=

        Number(

            this.perfil.tiempo_promedio

        );

        if(

            tiempo<=5

        ){

            this.recomendaciones.push({

                icono:'bi-lightning-charge',

                titulo:'Resolución muy rápida',

                descripcion:'Resuelves los cuestionarios con rapidez. Antes de finalizar, verifica tus respuestas para evitar errores por descuido.'

            });

        }

        else if(

            tiempo<=10

        ){

            this.recomendaciones.push({

                icono:'bi-stopwatch',

                titulo:'Buen ritmo de trabajo',

                descripcion:'Mantienes un tiempo adecuado para resolver los cuestionarios. Continúa con ese ritmo.'

            });

        }

        else if(

            tiempo<=15

        ){

            this.recomendaciones.push({

                icono:'bi-hourglass-split',

                titulo:'Mejora tu velocidad',

                descripcion:'Tu tiempo de resolución es mayor al esperado. Practicar con mayor frecuencia puede ayudarte a responder con más rapidez.'

            });

        }

        else{

            this.recomendaciones.push({

                icono:'bi-clock-history',

                titulo:'Resolución lenta',

                descripcion:'Dedicas bastante tiempo a cada cuestionario. Se recomienda reforzar los temas y practicar ejercicios similares para ganar agilidad.'

            });

        }

    }

    cargarEvolucion():void{

        this.estudianteProfesorService

        .obtenerEvolucionRendimiento(

            this.idEstudiante

        )

        .subscribe({

            next:(data:any)=>{

                this.datosEvolucion=data;

                this.crearGraficoEvolucion();

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

    }

    private crearGraficoEvolucion():void{

        if(

            this.graficoEvolucion

        ){

            this.graficoEvolucion.destroy();

        }

        const canvas=

        document.getElementById(

            'graficoEvolucion'

        ) as HTMLCanvasElement;

        if(

            !canvas

        ){

            return;

        }

        this.graficoEvolucion=

        new Chart(

            canvas,

            {

                type:'line',

                data:{

                    labels:

                    this.datosEvolucion.map(

                        (x:any)=>x.fecha

                    ),

                    datasets:[{

                        label:'Rendimiento (%)',

                        data:

                        this.datosEvolucion.map(

                            (x:any)=>x.porcentaje

                        ),

                        borderColor:'#8b00ff',

                        backgroundColor:'rgba(139,0,255,.15)',

                        borderWidth:3,

                        tension:.35,

                        fill:true,

                        pointRadius:5,

                        pointHoverRadius:7

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:false

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            max:100,

                            ticks:{

                                callback:(value)=>`${value}%`

                            }

                        }

                    }

                }

            }

        );

    }

    cargarPrecisionDificultad():void{

        this.estudianteProfesorService

        .obtenerPrecisionDificultad(

            this.idEstudiante

        )

        .subscribe({

            next:(data:any)=>{

                this.datosDificultad=data;

                this.crearGraficoDificultad();

            },

            error:(err)=>{

                console.error(err);

            }

        });

    }

    crearGraficoDificultad():void{

        if(

            this.graficoDificultad

        ){

            this.graficoDificultad.destroy();

        }

        this.graficoDificultad=

        new Chart(

            'graficoDificultad',

            {

                type:'doughnut',

                    data:{

                        labels:

                        this.datosDificultad.map(

                            (x:any)=>x.dificultad

                        ),

                        datasets:[

                            {

                                data:

                                this.datosDificultad.map(

                                    (x:any)=>x.promedio

                                ),

                                backgroundColor:[

                                    '#22c55e',

                                    '#f59e0b',

                                    '#ef4444'

                                ],

                                borderColor:'#ffffff',

                                borderWidth:3,

                                hoverOffset:12

                            }

                        ]

                    },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    cutout:'65%',

                    plugins:{

                        legend:{

                            position:'bottom',

                            labels:{

                                usePointStyle:true,

                                pointStyle:'circle',

                                padding:20,

                                font:{

                                    size:13

                                }

                            }

                        },

                        tooltip:{

                            callbacks:{

                                label:(context:any)=>{

                                    return context.label+

                                    ': '+context.raw+'%';

                                }

                            }

                        }

                    }

                }

            }

        );

    }

    exportarPDF():void{

        this.pdfExportService.exportarPerfilEstudiante(

            this.perfil,

            this.nombreProfesor,

            this.comparacionCurso,

            this.recomendaciones,

            this.datosCompetencias,

            this.datosSubmodulos

        );

        this.mostrarMenuExportar=false;

    }

    exportarExcel():void{

        this.excelExportService.exportarPerfilEstudiante(

            this.perfil,

            this.comparacionCurso,

            this.recomendaciones,

            this.datosCompetencias,

            this.datosSubmodulos,

            this.datosTemas

        );

        this.mostrarMenuExportar=false;

    }

    private crearGraficoComparacionCurso():void{

        const canvas=

        document.getElementById(

            'graficoComparacionCurso'

        ) as HTMLCanvasElement;

        if(!canvas){

            return;

        }

        new Chart(

            canvas,

            {

                type:'bar',

                data:{

                    labels:[

                        'Estudiante',

                        'Curso'

                    ],

                    datasets:[

                        {

                            data:[

                                this.comparacionCurso.promedio_estudiante,

                                this.comparacionCurso.promedio_curso

                            ],

                            backgroundColor:[

                                '#7C3AED',

                                '#C4B5FD'

                            ],

                            borderRadius:10

                        }

                    ]

                },

                options:{

                    responsive:false,

                    plugins:{

                        legend:{

                            display:false

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            max:100

                        }

                    }

                }

            }

        );

    }

    cargarHistorialEvaluaciones():void{

        this.estudianteProfesorService

        .obtenerHistorialEvaluaciones(

            this.idEstudiante

        )

        .subscribe({

            next:(data:any[])=>{

                this.historialEvaluaciones=data;

                console.log(

                    'Historial',

                    data

                );

                this.refrescarVista();

            },

            error:(error)=>{

                console.error(

                    error

                );

            }

        });

    }

    verDetalle(

        intento:any

    ):void{

        if(

            this.evaluacionSeleccionada===

            intento.id_resultado

        ){

            this.cerrarDetalle();

            return;

        }

        this.evaluacionSeleccionada=

        intento.id_resultado;

        this.cargarDetalleHistorial(

            intento.id_resultado

        );

    }

    cerrarDetalle():void{

        this.evaluacionSeleccionada=null;

        this.detalleHistorial=[];

    }

    cargarDetalleHistorial(

        idResultado:number

    ):void{

        this.estudianteProfesorService

        .obtenerDetalleHistorial(

            idResultado

        )

        .subscribe({

            next:(data:any[])=>{

                this.detalleHistorial=data;

                this.refrescarVista();

                console.log(

                    'Detalle historial',

                    data

                );

            },

            error:(error)=>{

                console.error(

                    error

                );

            }

        });

    }

}
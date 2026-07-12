import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';

import {
  PLATFORM_ID,
  inject
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  CommonModule
} from '@angular/common';

import {
  Chart
} from 'chart.js/auto';

import {

TopbarProfesorComponent

} from '../../components/topbar-profesor/topbar-profesor.component';

import {

SidebarProfesorComponent

} from '../../components/sidebar-profesor/sidebar-profesor.component';

import {

DashboardProfesorService

} from '../../services/dashboard-profesor.service';

import {
  Router
} from '@angular/router';

import {

  ChangeDetectorRef

} from '@angular/core';


@Component({
  selector: 'app-dashboard-profesor',
  standalone: true,
  imports: [
    CommonModule,
    TopbarProfesorComponent,
    SidebarProfesorComponent
  ],
  templateUrl:
    './dashboard-profesor.component.html',

  styleUrl:
    './dashboard-profesor.component.css'
})



export class DashboardProfesorComponent
implements OnInit{
  private platformId =
    inject(PLATFORM_ID);
  nombreProfesor = '';

  idProfesor=0;

  totalEstudiantes='--';

  totalEvaluaciones='--';

  precisionPromedio='--';

  competenciaCritica='--';

  menuAbierto=false;

  graficoCompetencias!:Chart;

  datosCompetencias:any[]=[];

  preguntasError:any[]=[];

  graficoDificultad!: Chart;

  datosDificultad:any[]=[];

  graficoSubmodulos!: Chart;

  datosSubmodulos:any[]=[];

  graficoTemas!: Chart;

  datosTemas:any[]=[];

  actividades:any[]=[];

  constructor(
    private router: Router,

    private dashboardProfesorService:
    DashboardProfesorService,
    
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    if(

        isPlatformBrowser(

            this.platformId

        )

    ){

        this.nombreProfesor=

        localStorage.getItem(

            'nombre_profesor'

        ) || 'Profesor';

        this.idProfesor = Number(

            localStorage.getItem(

                'id_profesor'

            )

        );

        this.cargarResumen();

        this.cargarGraficoCompetencias();

        this.cargarPreguntasError();

        this.cargarGraficoDificultad();

        this.cargarGraficoSubmodulos();

        this.cargarGraficoTemas();

        this.cargarActividadReciente();

    }

  }

  irPreguntas(): void {

    console.log('Navegando a preguntas');

    this.router.navigate([
      '/preguntas'
    ]);

  }

  toggleMenu(){

    this.menuAbierto=

    !this.menuAbierto;

  }

  cargarResumen():void{

    this.dashboardProfesorService

        .obtenerResumen(

            this.idProfesor

        )

        .subscribe({

            next:(data)=>{

                this.totalEstudiantes=

                data.estudiantes_activos;

                this.totalEvaluaciones=

                data.evaluaciones;

                this.precisionPromedio=

                data.precision_promedio + '%';

                this.competenciaCritica=

                data.competencia_critica;

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

  cargarGraficoCompetencias():void{

    this.dashboardProfesorService

        .obtenerCompetencias(

            this.idProfesor

        )

        .subscribe({

            next:(data)=>{

                this.datosCompetencias=data;

                this.crearGraficoCompetencias();

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

  }

  crearGraficoCompetencias():void{

    if(

        this.graficoCompetencias

    ){

        this.graficoCompetencias.destroy();

    }

    this.graficoCompetencias = new Chart(

        "graficoCompetencias",

        {

            type:"bar",

            data:{

                labels:

                    this.datosCompetencias.map(

                        x=>x.competencia

                    ),

                datasets:[

                    {

                        label:"Precisión (%)",

                        data:

                            this.datosCompetencias.map(

                                x=>x.promedio

                            ),

                        borderRadius:10,

                        backgroundColor:[

                            "#8b5cf6",

                            "#22c55e",

                            "#f59e0b",

                            "#3b82f6"

                        ]

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


  cargarPreguntasError():void{

    this.dashboardProfesorService

        .obtenerPreguntasError(

            this.idProfesor

        )

        .subscribe({

            next:(data)=>{

                this.preguntasError=data;

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

  }

    cargarGraficoDificultad():void{

        this.dashboardProfesorService

        .obtenerPrecisionDificultad(

            this.idProfesor

        )

        .subscribe({

            next:(data)=>{

                console.log(

                    "Precisión por dificultad",

                    data

                );

                this.datosDificultad=data;

                this.crearGraficoDificultad();

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

    }

    crearGraficoDificultad():void{

            if(this.graficoDificultad){

                this.graficoDificultad.destroy();

            }

            this.graficoDificultad = new Chart(

                "graficoDificultad",

                {

                    type:"bar",

                    data:{

                        labels:

                            this.datosDificultad.map(

                                x=>x.dificultad

                            ),

                        datasets:[

                            {

                                label:

                                "Precisión (%)",

                                data:

                                    this.datosDificultad.map(

                                        x=>x.promedio

                                    ),

                                backgroundColor:[

                                    "#22c55e",

                                    "#f59e0b",

                                    "#ef4444"

                                ],

                                borderRadius:10,

                                borderSkipped:false

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

        cargarGraficoSubmodulos():void{

            this.dashboardProfesorService

                .obtenerSubmodulos(

                    this.idProfesor

                )

                .subscribe({

                    next:(data)=>{

                        console.log(

                            "Submódulos",

                            data

                        );

                        this.datosSubmodulos=data;

                        this.crearGraficoSubmodulos();

                        this.refrescarVista();

                    },

                    error:(err)=>{

                        console.error(err);

                    }

                });

        }

        crearGraficoSubmodulos():void{

            if(this.graficoSubmodulos){

                this.graficoSubmodulos.destroy();

            }

            this.graficoSubmodulos = new Chart(

                "graficoSubmodulos",

                {

                    type:"pie",

                    data:{

                        labels:

                            this.datosSubmodulos.map(

                                x=>x.submodulo

                            ),

                        datasets:[

                            {

                                data:

                                    this.datosSubmodulos.map(

                                        x=>x.promedio

                                    ),

                                backgroundColor:[

                                    "#7c3aed",

                                    "#3b82f6",

                                    "#22c55e",

                                    "#f59e0b",

                                    "#ef4444",

                                    "#14b8a6",

                                    "#8b5cf6",

                                    "#ec4899"

                                ],

                                borderWidth:2,

                                borderColor:"#ffffff"

                            }

                        ]

                    },

                    options:{

                        responsive:true,

                        maintainAspectRatio:false,

                        plugins:{

                            legend:{

                                position:"bottom"

                            }

                        }

                    }

                }

            );

        }


        cargarGraficoTemas():void{

            this.dashboardProfesorService

                .obtenerTemas(

                    this.idProfesor

                )

                .subscribe({

                    next:(data)=>{

                        console.log(

                            "Temas",

                            data

                        );

                        this.datosTemas=data;

                        this.crearGraficoTemas();

                        this.refrescarVista();

                    },

                    error:(err)=>{

                        console.error(err);

                    }

                });

        }

        crearGraficoTemas():void{

        if(this.graficoTemas){

            this.graficoTemas.destroy();

        }

        this.graficoTemas = new Chart(

            "graficoTemas",

            {

                type:"bar",

                data:{

                    labels:

                        this.datosTemas.map(

                            x=>x.tema

                        ),

                    datasets:[

                        {

                            label:

                            "Promedio (%)",

                            data:

                            this.datosTemas.map(

                                x=>x.promedio

                            ),

                            backgroundColor:[

                                "#8b5cf6",

                                "#22c55e",

                                "#f59e0b",

                                "#3b82f6",

                                "#ef4444",

                                "#06b6d4",

                                "#14b8a6",

                                "#ec4899",

                                "#f97316",

                                "#84cc16"

                            ],

                            borderRadius:8

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    indexAxis:"y",

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


    cargarActividadReciente():void{

        this.dashboardProfesorService

            .obtenerActividadReciente(

                this.idProfesor

            )

            .subscribe({

                next:(data)=>{

                    this.actividades=data;

                    this.refrescarVista();

                },

                error:(err)=>{

                    console.error(err);

                }

            });

    }

    haceCuanto(fecha:string):string{

        const ahora=new Date();

        const f=new Date(fecha);

        const segundos=(

            ahora.getTime()-f.getTime()

        )/1000;

        if(segundos<60){

            return "Hace unos segundos";

        }

        if(segundos<3600){

            return `Hace ${Math.floor(segundos/60)} min`;

        }

        if(segundos<86400){

            return `Hace ${Math.floor(segundos/3600)} h`;

        }

        return `Hace ${Math.floor(segundos/86400)} días`;

    }

}
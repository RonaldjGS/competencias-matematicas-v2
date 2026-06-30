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

  

}
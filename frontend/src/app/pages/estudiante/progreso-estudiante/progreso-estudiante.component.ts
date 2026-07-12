import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  TopbarEstudianteComponent
} from '../../../components/topbar-estudiante/topbar-estudiante.component';

import {
  SidebarEstudianteComponent
} from '../../../components/sidebar-estudiante/sidebar-estudiante.component';

import {
  ProgresoEstudianteService
} from '../../../services/progreso-estudiante.service';

import {

    CompetenciaService

} from '../../../services/competencia.service';

import {
  SubmoduloService
} from '../../../services/submodulo.service';

import {
  TemaService
} from '../../../services/tema.service';

import Chart from 'chart.js/auto';

import {

    FormsModule

} from '@angular/forms';

import {
  ChangeDetectorRef
} from '@angular/core';

@Component({

  selector:'app-progreso-estudiante',

  standalone:true,

  imports:[
    CommonModule,
    FormsModule,
    TopbarEstudianteComponent,
    SidebarEstudianteComponent
  ],

  templateUrl:'./progreso-estudiante.component.html',

  styleUrl:'./progreso-estudiante.component.css'

})

export class ProgresoEstudianteComponent
implements OnInit{

  idEstudiante = Number(

    localStorage.getItem(
        'id_estudiante'
    )

  );

  idNivel = Number(

      localStorage.getItem(
          'id_nivel'
      )

  );

  nombreEstudiante='';

  menuAbierto=false;

  promedioGeneral='--';

  testRealizados='--';

  precisionPromedio='--';

  tiempoPromedio='--';

  graficoTemas!: Chart;

  datosTemas:any[]=[];

  graficoEvolucion!: Chart;

  datosEvolucion:any[]=[];

  filtroEvolucion='7';

  graficoCompetencias!: Chart;

  graficoSubmodulos!: Chart;

  datosSubmodulos:any[]=[];

  graficoDificultad!: Chart;

  // ===============================
  // FILTROS
  // ===============================

  competencias:any[] = [];

  submodulos:any[] = [];

  temas:any[] = [];

  competenciaSeleccionada:number | null = null;

  submoduloSeleccionado:number | null = null;

  temaSeleccionado:number | null = null;

  historial:any[]=[];



  constructor(

    private progresoService:
    ProgresoEstudianteService,

    private cdr:
    ChangeDetectorRef,

    private competenciaService:
    CompetenciaService,

    private submoduloService: SubmoduloService,

    private temaService: TemaService

  ){}

  ngOnInit():void{

      this.nombreEstudiante=

      localStorage.getItem(

          'nombre_estudiante'

      ) || 'Estudiante';

      this.idEstudiante = Number(

        localStorage.getItem(

            'id_estudiante'

        )

      );

      this.cargarResumen();

      this.cargarGraficoTemas();

      this.cargarGraficoEvolucion();

      this.cargarGraficoCompetencias();

      this.cargarGraficoSubmodulos();

      this.cargarGraficoDificultad();

      this.cargarCompetencias();

      this.cargarSubmodulos();

      this.cargarTemas();

      this.cargarHistorial();

  }

  cargarResumen():void{

    const idEstudiante = Number(

        localStorage.getItem(

            'id_estudiante'

        )

    );

    this.progresoService

        .obtenerResumen(

            idEstudiante

        )

        .subscribe({

            next:(data)=>{

                this.promedioGeneral =

                    data.promedio_general != null

                    ? data.promedio_general + '%'

                    : '--';

                this.testRealizados =

                    data.test_realizados ?? '--';

                this.precisionPromedio =

                    data.precision_promedio != null

                    ? data.precision_promedio + '%'

                    : '--';

                this.tiempoPromedio =

                    data.tiempo_promedio != null

                    ? this.formatearTiempo(

                        data.tiempo_promedio

                    )

                    : '--';

                this.refrescarVista();

            },

            error:(error)=>{

                console.error(

                    error

                );

            }

        });

  }

  toggleMenu(): void {

    this.menuAbierto =
      !this.menuAbierto;

  }

  private refrescarVista():void{

    this.cdr.detectChanges();

  }

  formatearTiempo(

    segundos:number

  ):string{

      if(

          segundos < 60

      ){

          return `${segundos} s`;

      }

      const minutos = Math.floor(

          segundos/60

      );

      const resto =

          segundos%60;

      return `${minutos} min ${resto} s`;

  }

  cargarGraficoTemas():void{

    const idEstudiante = Number(

        localStorage.getItem(

            'id_estudiante'

        )

    );

    this.progresoService

        .obtenerTemas(

            idEstudiante

        )

        .subscribe({

            next:(data)=>{

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

                        borderRadius:8,

                        backgroundColor:[

                            "#8b5cf6",

                            "#22c55e",

                            "#f59e0b",

                            "#3b82f6",

                            "#ef4444"

                        ]

                    }

                ]

            },

            options:{

                responsive:true,

                indexAxis:'y',

                plugins:{

                    legend:{

                        display:false

                    }

                },

                scales:{

                    x:{

                        max:100,

                        beginAtZero:true

                    }

                }

            }

        }

    );

  }

  cargarGraficoEvolucion():void{

    const idEstudiante = Number(

        localStorage.getItem(

            'id_estudiante'

        )

    );

    this.progresoService

        .obtenerEvolucion(

            idEstudiante,

            this.filtroEvolucion
            

        )

        .subscribe({

            next:(data)=>{

                this.datosEvolucion=data;

                this.crearGraficoEvolucion();

                this.refrescarVista();

            }

        });

  }

  crearGraficoEvolucion():void{

    if(

        this.graficoEvolucion

    ){

        this.graficoEvolucion.destroy();

    }

    this.graficoEvolucion = new Chart(

        "graficoEvolucion",

        {

            type:"line",

            data:{

                labels:

                    this.datosEvolucion.map(

                        x=>x.fecha

                    ),

                datasets:[

                    {

                        label:

                        "Promedio",

                        data:

                        this.datosEvolucion.map(

                            x=>x.promedio

                        ),

                        borderColor:"#8b5cf6",

                        backgroundColor:

                        "rgba(139,92,246,.15)",

                        borderWidth:4,

                        pointRadius:6,

                        pointHoverRadius:8,

                        pointBackgroundColor:"#8b5cf6",

                        fill:true,

                        tension:.35

                    }

                ]

            },

            options:{

                responsive:true,

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
  
  cambiarFiltro():void{

    this.cargarGraficoEvolucion();

  }

  cargarGraficoCompetencias():void{

    const idEstudiante = Number(

        localStorage.getItem(

            'id_estudiante'

        )

    );

    this.progresoService

        .obtenerCompetencias(

            idEstudiante

        )

        .subscribe({

            next:(datos)=>{

                this.crearGraficoCompetencias(

                    datos

                );

                this.refrescarVista();

            }

        });

  }

  crearGraficoCompetencias(

    datos:any[]

){

    if(this.graficoCompetencias){

        this.graficoCompetencias.destroy();

    }

    this.graficoCompetencias = new Chart(

        "graficoCompetencias",

        {

            type:"pie",

            data:{

                labels:datos.map(

                    x=>x.competencia

                ),

                datasets:[{

                    data:datos.map(

                        x=>x.promedio

                    ),

                    backgroundColor:[

                        "#7c3aed",

                        "#22c55e",

                        "#f59e0b",

                        "#3b82f6"

                    ],

                    borderWidth:0

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

  }

  cargarGraficoSubmodulos():void{

    this.progresoService

        .obtenerSubmodulos(

            this.idEstudiante

        )

        .subscribe({

            next:(data)=>{

                this.datosSubmodulos = data;

                this.crearGraficoSubmodulos();

                this.refrescarVista();

            }

        });

  }

  crearGraficoSubmodulos():void{

    if(

        this.graficoSubmodulos

    ){

        this.graficoSubmodulos.destroy();

    }

    this.graficoSubmodulos = new Chart(

        "graficoSubmodulos",

        {

            type:"bar",

            data:{

                labels:

                    this.datosSubmodulos.map(

                        x=>x.submodulo

                    ),

                datasets:[{

                    label:"Promedio",

                    data:

                        this.datosSubmodulos.map(

                            x=>x.promedio

                        ),

                    borderRadius:10,

                    backgroundColor:[

                        "#7c3aed",

                        "#22c55e",

                        "#3b82f6",

                        "#f59e0b"

                    ]

                }]

            },

            options:{

                responsive:true,

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

  cargarGraficoDificultad():void{

    const idEstudiante = Number(

        localStorage.getItem(

            'id_estudiante'

        )

    );

    this.progresoService

        .obtenerDificultades(

            idEstudiante,

            this.competenciaSeleccionada ?? undefined,

            this.submoduloSeleccionado ?? undefined,

            this.temaSeleccionado ?? undefined

        )

        .subscribe({

            next:(datos)=>{

                this.crearGraficoDificultad(

                    datos

                );

                this.refrescarVista();

            }

        });

  }

  crearGraficoDificultad(

    datos:any[]

  ):void{

    if(

        this.graficoDificultad

    ){

        this.graficoDificultad.destroy();

    }

    this.graficoDificultad = new Chart(

        "graficoDificultad",

        {

            type:"radar",

            data:{

                labels:

                    datos.map(

                        x=>x.dificultad

                    ),

                datasets:[

                    {

                        label:

                        "Promedio",

                        data:

                        datos.map(

                            x=>x.promedio

                        ),

                        backgroundColor:

                        "rgba(124,58,237,.25)",

                        borderColor:

                        "#7c3aed",

                        borderWidth:3,

                        pointRadius:5,

                        pointBackgroundColor:"#7c3aed"

                    }

                ]

            },

            options:{

                responsive:true,

                scales:{

                    r:{

                        suggestedMin:0,

                        suggestedMax:100,

                        ticks:{

                            stepSize:20

                        }

                    }

                },

                plugins:{

                    legend:{

                        display:false

                    }

                }

            }

        }

    );

  }

  actualizarRadar():void{

    if(this.competenciaSeleccionada){

        this.cargarSubmodulos();

    }

    if(this.submoduloSeleccionado){

        this.cargarTemas();

    }

    this.cargarGraficoDificultad();

  }

  cargarCompetencias(): void {

    this.competenciaService
        .obtenerCompetencias()
        .subscribe({

            next: (data) => {

                console.log("COMPETENCIAS");
                console.log(data);

                this.competencias = data;

                this.refrescarVista();

            },

            error: (err) => {

                console.log(err);

            }

        });

  }

  cargarSubmodulos():void{

    if(this.competenciaSeleccionada==null){

        this.submodulos=[];

        this.temas=[];

        return;

    }

    const idEstudiante = Number(

        localStorage.getItem(
            'id_estudiante'
        )

    );

    this.submoduloService

        .obtenerSubmodulosDisponibles(

            idEstudiante,

            this.competenciaSeleccionada

        )

        .subscribe({

            next:(data)=>{

                this.submodulos=data;

                this.temas=[];

                this.submoduloSeleccionado=null;

                this.temaSeleccionado=null;

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

  }

  cargarTemas():void{

    if(this.submoduloSeleccionado==null){

        this.temas=[];

        return;

    }

    const idNivel = Number(

        localStorage.getItem(
            'id_nivel'
        )

    );

    const idEstudiante = Number(

        localStorage.getItem(
            'id_estudiante'
        )

    );

    this.temaService

        .obtenerTemas(

            idNivel,

            idEstudiante,

            this.competenciaSeleccionada!,

            this.submoduloSeleccionado

        )

        .subscribe({

            next:(data)=>{

                this.temas=data;

                this.temaSeleccionado=null;

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

  }

  cargarHistorial():void{

    this.progresoService

        .obtenerHistorial(

            this.idEstudiante

        )

        .subscribe({

            next:(data)=>{

                this.historial =

                    data.map(item=>({

                        ...item,

                        tiempoTexto:

                            this.formatearTiempo(

                                item.tiempo

                            ),

                        hace:

                            this.calcularTiempo(

                                item.fecha

                            )

                    }));

                this.refrescarVista();

            },

            error:(err)=>{

                console.error(err);

            }

        });

  }

  calcularTiempo(

      fecha:string

    ):string{

      const ahora =

          new Date();

      const realizada =

          new Date(fecha);

      const diferencia =

          Math.floor(

              (

                  ahora.getTime()

                  -

                  realizada.getTime()

              )/1000

          );

      if(

          diferencia < 60

      ){

          return `Hace ${diferencia} s`;

      }

      if(

          diferencia < 3600

      ){

          return `Hace ${Math.floor(diferencia/60)} min`;

      }

      if(

          diferencia < 86400

      ){

          return `Hace ${Math.floor(diferencia/3600)} h`;

      }

      return `Hace ${Math.floor(diferencia/86400)} días`;

  }

}
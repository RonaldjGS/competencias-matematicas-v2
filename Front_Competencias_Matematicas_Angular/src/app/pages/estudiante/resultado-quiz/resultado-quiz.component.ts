import {

  Component,

  OnInit,

  Inject,

  PLATFORM_ID

} from '@angular/core';

import { Router } from '@angular/router';

import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';


import {
  isPlatformBrowser
} from '@angular/common';

import {

  ActivatedRoute

} from '@angular/router';

import { ResultadoQuizService }
from '../../../services/resultado-quiz.service';

import { CommonModule } from '@angular/common';

import {

    ChangeDetectorRef

} from '@angular/core';



Chart.register(

  DoughnutController,

  ArcElement,

  Tooltip,

  Legend

);


@Component({

  selector: 'app-resultado-quiz',

  standalone: true,

  imports: [

    CommonModule

  ],

  templateUrl: './resultado-quiz.component.html',

  styleUrl: './resultado-quiz.component.css'

})



export class ResultadoQuizComponent
implements OnInit {

  idResultado!: number;

  resultado: any;

  nombreEstudiante: string = '';

  // =====================================
  // RESUMEN
  // =====================================

  porcentaje = 0;

  nivelDesempeno = '';

  correctas = 0;

  incorrectas = 0;

  totalPreguntas = 0;

  tiempoSegundos = 0;

  retroalimentacion = '';

  intentosUtilizados = 0;

  mejora: number | null = null;

  grafico: Chart | null = null;

  colorNivel = 'nivel-verde';

  iconoNivel = '';

  estrellas: number[] = [];

  colorGrafico = '#22c55e';

  colorFondo = '#e5e7eb';

  constructor(

    private route: ActivatedRoute,

    private resultadoQuizService: ResultadoQuizService,

    private cdr: ChangeDetectorRef,

    private router: Router,

    @Inject(PLATFORM_ID)
    private platformId: Object

  ) {}

  ngOnInit(): void {

    if (

      isPlatformBrowser(

        this.platformId

      )

    ) {

      this.nombreEstudiante =

        localStorage.getItem(

          'nombre_estudiante'

        ) || 'Estudiante';

    }

    this.idResultado = Number(

      this.route.snapshot.paramMap.get('id')

    );

    console.log(

      'ID RESULTADO',

      this.idResultado

    );

    this.cargarResultado();

  }

  // =====================================
  // CARGAR RESULTADO
  // =====================================

  cargarResultado(): void {

    this.resultadoQuizService

      .obtenerResultado(

        this.idResultado

      )

      .subscribe({

        next: (resp) => {

          console.log(
            'RESULTADO COMPLETO'
          );

          console.log(resp);

          this.resultado = resp;
          
          // ==========================
          // RESUMEN
          // ==========================

          this.porcentaje =
            resp.porcentaje;

          this.nivelDesempeno =
            resp.nivel_desempeno;

          this.correctas =
            resp.correctas;

          this.incorrectas =
            resp.incorrectas;

          this.totalPreguntas =
            resp.total_preguntas;

          this.tiempoSegundos =
            resp.tiempo_segundos;

          this.retroalimentacion =
            resp.retroalimentacion;

          this.intentosUtilizados =
            resp.intento;

          this.mejora =
            resp.mejora;

          // ==========================
          // CONFIGURAR COLORES
          // ==========================

          if (this.porcentaje >= 80) {

              this.colorGrafico = '#22c55e';

          }

          else if (this.porcentaje >= 50) {

              this.colorGrafico = '#f59e0b';

          }

          else {

              this.colorGrafico = '#ef4444';

          }

          // ==========================
          // CONFIGURAR TARJETA
          // ==========================

          this.configurarNivel();
          
          // ==========================
          // CREAR GRÁFICO
          // ==========================

          this.refrescarVista();

          requestAnimationFrame(() => {

              this.crearGrafico();

          });

        },



        error: (err) => {

          console.error(err);

        }

      });

      

  }

  // =====================================
  // CREAR GRÁFICO
  // =====================================

  crearGrafico(): void {

    if (this.grafico) {

      this.grafico.destroy();

    }

    const canvas = document.getElementById(

      'graficoResultado'

    ) as HTMLCanvasElement;

    if (!canvas) {

      return;

    }

    this.grafico = new Chart(

      canvas,

      {

        type: 'doughnut',

        data: {

          labels: [

            'Correctas',

            'Incorrectas'

          ],

          datasets: [

            {

              data: [

                this.correctas,

                this.incorrectas

              ],

              backgroundColor:[

                '#22c55e',

                '#ef4444'

              ],

              borderWidth:0,

              hoverOffset:6

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio:false,

          cutout: '72%',

          plugins:{

            legend:{

                display:false

            },

            tooltip:{

                enabled:true

            }

          },

          animation:{

            animateRotate:true,

            duration:1800

          }

        }

      }

    );

  }

  configurarNivel(): void {

    switch (this.nivelDesempeno) {

        case 'Excelente':

            this.colorNivel = 'nivel-verde';
            this.estrellas = [1,2,3];
            break;

        case 'Competente':

            this.colorNivel = 'nivel-verde';
            this.estrellas = [1,2];
            break;

        case 'En proceso':

            this.colorNivel = 'nivel-amarillo';
            this.estrellas = [1,2];
            break;

        case 'En desarrollo':

            this.colorNivel = 'nivel-rojo';
            this.estrellas = [1];
            break;

    }

  }

  // =====================================
  // REPETIR EVALUACIÓN
  // =====================================

  repetirEvaluacion(): void {

    this.resultado = null;

    this.grafico?.destroy();

    this.router.navigate([

      '/video-introductorio'

    ]);

  }

  // =====================================
  // VER ESTADÍSTICAS
  // =====================================

  verEstadisticas(): void {

    alert(

      'Esta funcionalidad estará disponible próximamente.'

    );

  }

  // =====================================
  // MENÚ PRINCIPAL
  // =====================================

  irMenuPrincipal(): void {

    this.router.navigate([

      '/dashboard-estudiante'

    ]);

  }

  private refrescarVista(): void {

    this.cdr.detectChanges();

  }

}


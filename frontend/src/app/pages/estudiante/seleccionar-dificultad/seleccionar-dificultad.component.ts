import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  TopbarEstudianteComponent
} from '../../../components/topbar-estudiante/topbar-estudiante.component';

import {
  SidebarEstudianteComponent
} from '../../../components/sidebar-estudiante/sidebar-estudiante.component';

import {
  QuizConfigService
} from '../../../services/quiz-config.service';

import {
  EstadisticasTemaService
} from '../../../services/estadisticas-tema.service';

import {
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector:
    'app-seleccionar-dificultad',

  standalone: true,

  imports: [
    CommonModule,

    TopbarEstudianteComponent,
    
    SidebarEstudianteComponent
  ],

  templateUrl:
    './seleccionar-dificultad.component.html',

  styleUrl:
    './seleccionar-dificultad.component.css'
})

export class SeleccionarDificultadComponent
implements OnInit {

  nombreEstudiante = '';

  nombreModulo = '';

  nombreSubmodulo = '';

  nombreTema = '';

  menuAbierto = false;

  // =====================================
  // ESTADÍSTICAS
  // =====================================

  precisionPromedio = '--';

  intentosRealizados = '--';

  tiempoPromedio = '--';

  // =====================================
  // DIFICULTAD
  // =====================================

  dificultadSeleccionada:
    string | null = null;

  dificultades = [

    {

      nombre:
      'Básico',

      descripcion:
      'Conceptos fundamentales y ejercicios introductorios',

      tiempo:
      '10 min',

      recomendacion:
      'Nivel recomendado para iniciar'

    },

    {

      nombre:
      'Intermedio',

      descripcion:
      'Aplicaciones de conceptos en problemas modernos',

      tiempo:
      '15 min',

      recomendacion:
      'Ideal para reforzar conocimiento'

    },

    {

      nombre:
      'Avanzado',

      descripcion:
      'Problemas complejos que requieren mayor análisis',

      tiempo:
      '20 min',

      recomendacion:
      'Recomendado para nivel avanzado'

    }

  ];

  constructor(

    private router: Router,

    private quizConfigService:
    QuizConfigService,

    private cdr: ChangeDetectorRef,

    @Inject(PLATFORM_ID)
    private platformId: Object,

    private estadisticasTemaService:
    EstadisticasTemaService,

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
        ) || '';

      this.nombreModulo =

        localStorage.getItem(
          'nombre_nivel'
        ) || '';

      this.nombreSubmodulo =

        localStorage.getItem(
          'nombre_submodulo'
        ) || '';

      this.nombreTema =

        localStorage.getItem(
          'nombre_tema'
        ) || '';

    }

    

    this.cargarEstadisticas();

    this.refrescarVista();

  }

  seleccionarDificultad(
    dificultad: string
  ): void {

    this.dificultadSeleccionada =
      dificultad;

    this.refrescarVista();

  }

  continuar(): void {

    if (

      !this.dificultadSeleccionada

    ) {

      alert(

        'Debe seleccionar una dificultad antes de continuar.'

      );

      return;

    }

    if (

      isPlatformBrowser(
        this.platformId
      )

    ) {

      localStorage.setItem(

        'dificultad',

        this.dificultadSeleccionada

      );

    }

    this.quizConfigService
      .setDificultad(

        this.dificultadSeleccionada

      );

    console.log(

      this.quizConfigService
        .obtenerConfiguracion()

    );

    this.router.navigate([

      '/video-introductorio'

    ]);

  }

  toggleMenu(): void {

    this.menuAbierto =

      !this.menuAbierto;

  }

  volver(): void {

    this.router.navigate([

      '/seleccionar-tema'

    ]);

  }

  private refrescarVista(): void {

    this.cdr.detectChanges();

  }

  cargarEstadisticas(): void {

      const idEstudiante = Number(

          localStorage.getItem(
              'id_estudiante'
          )

      );

      const idCompetencia = Number(

          localStorage.getItem(
              'id_competencia'
          )

      );

      const idSubmodulo = Number(

          localStorage.getItem(
              'id_submodulo'
          )

      );

      const idTema = Number(

          localStorage.getItem(
              'id_tema'
          )

      );

      this.estadisticasTemaService

          .obtenerEstadisticas(

              idEstudiante,

              idCompetencia,

              idSubmodulo,

              idTema

          )

          .subscribe({

              next:(data)=>{

                  this.precisionPromedio =

                      data.precision_promedio != null

                      ? data.precision_promedio + '%'

                      : '--';

                  this.intentosRealizados =

                      data.intentos_realizados;

                  this.tiempoPromedio =

                      data.tiempo_promedio != null

                      ? this.formatearTiempo(
                          data.tiempo_promedio
                      )

                      : '--';

                  this.refrescarVista();

              }

          });

  }

  formatearTiempo(
      segundos:number
  ):string{

      const min =

          Math.floor(segundos/60);

      const seg =

          segundos%60;

      return `${min}:${seg.toString().padStart(2,'0')}`;

  }

}
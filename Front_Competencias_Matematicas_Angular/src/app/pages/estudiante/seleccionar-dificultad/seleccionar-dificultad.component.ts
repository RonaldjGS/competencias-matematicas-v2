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
  QuizConfigService
} from '../../../services/quiz-config.service';

@Component({
  selector:
    'app-seleccionar-dificultad',

  standalone: true,

  imports: [
    CommonModule
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

  dificultadSeleccionada =
    'Básico';

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

  }

  seleccionarDificultad(
    dificultad: string
  ): void {

    this.dificultadSeleccionada =
      dificultad;

  }

  continuar(): void {

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

      '/videos'

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

}
import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  CompetenciaService
} from '../../../services/competencia.service';

import {
  QuizConfigService
} from '../../../services/quiz-config.service';

import {
  PLATFORM_ID,
  inject
} from '@angular/core';

@Component({
  selector:
    'app-seleccionar-competencia',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './seleccionar-competencia.component.html',

  styleUrl:
    './seleccionar-competencia.component.css'
})

export class SeleccionarCompetenciaComponent
implements OnInit {

  private platformId =
    inject(PLATFORM_ID);

  nombreEstudiante = '';

  menuAbierto = false;

  competencias: any[] = [];

  // ==========================
  // ESTADÍSTICAS
  // ==========================

  nombreModulo = '';

  precisionPromedio = '--';

  tiempoPromedio = '--';

  evaluacionesRealizadas = '--';

  constructor(

    private router: Router,

    private competenciaService:
    CompetenciaService,

    private quizConfigService:
    QuizConfigService

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

      this.nombreModulo =

        localStorage.getItem(
          'nombre_nivel'
        ) ||

        'Entrenamiento Matemático';

    }

    this.cargarCompetencias();

  }

  cargarCompetencias(): void {

    this.competenciaService
      .obtenerCompetencias()
      .subscribe({

        next: (data) => {

          this.competencias =
            data;

          console.log(
            'Competencias:',
            data
          );

        },

        error: (error) => {

          console.error(
            'Error cargando competencias',
            error
          );

        }

      });

  }

  seleccionarCompetencia(
    competencia: any
  ): void {

    this.quizConfigService
      .setCompetencia(
        competencia.id_competencia
      );

    console.log(

      this.quizConfigService
        .obtenerConfiguracion()

    );

    this.router.navigate([

      '/seleccionar-modalidad'

    ]);

  }

  toggleMenu(): void {

    this.menuAbierto =
      !this.menuAbierto;

  }

  volver(): void {

    this.router.navigate([

      '/dashboard-estudiante'

    ]);

  }

}
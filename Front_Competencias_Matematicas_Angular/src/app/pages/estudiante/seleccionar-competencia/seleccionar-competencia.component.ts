import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
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

import {
  isPlatformBrowser
} from '@angular/common';

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

  // ===========================
  // ESTADISTICAS
  // ===========================

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

        const idNivel = Number(

        localStorage.getItem(
            'id_nivel'
        )

        );

        switch (idNivel) {

        case 1:

            this.nombreModulo =
            'Bachillerato';

            break;

        case 2:

            this.nombreModulo =
            'Nivelación y Admisión';

            break;

        case 3:

            this.nombreModulo =
            'Primer Semestre';

            break;

        default:

            this.nombreModulo =
            'Entrenamiento Matemático';

        }

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

        },

        error: (error) => {

          console.error(
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
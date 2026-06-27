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

import {
  SubmoduloService
} from '../../../services/submodulo.service';

@Component({
  selector:
    'app-seleccionar-modalidad',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './seleccionar-modalidad.component.html',

  styleUrl:
    './seleccionar-modalidad.component.css'
})

export class SeleccionarModalidadComponent
implements OnInit {

  nombreEstudiante = '';

  menuAbierto = false;

  nombreModulo = '';

  precisionPromedio = '--';

  tiempoPromedio = '--';

  evaluacionesRealizadas = '--';

  submodulos: any[] = [];

  constructor(

    private router: Router,

    private quizConfigService:
    QuizConfigService,

    private submoduloService:
    SubmoduloService,

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

      this.nombreModulo =

        localStorage.getItem(
          'nombre_nivel'
        ) ||

        'Entrenamiento Matemático';

    }

    this.cargarSubmodulos();

  }

  cargarSubmodulos(): void {

    if (

        !isPlatformBrowser(
        this.platformId
        )

    ) {

        return;

    }

    const idEstudiante = Number(

        localStorage.getItem(
        'id_estudiante'
        )

    );

    const config =

        this.quizConfigService
        .obtenerConfiguracion();

    this.submoduloService
        .obtenerSubmodulosDisponibles(

        idEstudiante,

        config.idCompetencia!

        )

        .subscribe({

        next: (data) => {

            this.submodulos =
            data;

        },

        error: (error) => {

            console.error(
            error
            );

        }

        });

    }

  seleccionarSubmodulo(
    submodulo: any
  ): void {

    if (

      submodulo.estado ===
      'bloqueado'

    ) {

      return;

    }

    if (

      isPlatformBrowser(
        this.platformId
      )

    ) {

      localStorage.setItem(
        'id_submodulo',
        submodulo.id_submodulo
      );

      localStorage.setItem(

        'nombre_submodulo',

        submodulo.nombre_submodulo

      );

    }

    this.quizConfigService
      .setSubmodulo(

        submodulo.id_submodulo

      );

    this.quizConfigService
      .setNombreSubmodulo(
        submodulo.nombre_submodulo
      );

    console.log(

      this.quizConfigService
        .obtenerConfiguracion()

    );

    this.router.navigate([

      '/seleccionar-tema'

    ]);

  }

  toggleMenu(): void {

    this.menuAbierto =

      !this.menuAbierto;

  }

  volver(): void {

    this.router.navigate([

      '/seleccionar-competencia'

    ]);

  }

}
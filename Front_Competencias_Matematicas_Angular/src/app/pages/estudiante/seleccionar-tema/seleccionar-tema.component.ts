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
  TemaService
} from '../../../services/tema.service';

@Component({
  selector:
    'app-seleccionar-tema',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './seleccionar-tema.component.html',

  styleUrl:
    './seleccionar-tema.component.css'
})

export class SeleccionarTemaComponent
implements OnInit {

  nombreEstudiante = '';

  nombreModulo = '';

  nombreCompetencia = '';

  nombreSubmodulo = '';

  menuAbierto = false;

  temas: any[] = [];

  constructor(

    private router: Router,

    private temaService:
    TemaService,

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

      this.nombreCompetencia =

        localStorage.getItem(
          'nombre_competencia'
        ) || '';

      this.nombreSubmodulo =

        localStorage.getItem(
          'nombre_submodulo'
        ) || '';

    }

    this.cargarTemas();

  }

  cargarTemas(): void {

        if (

            !isPlatformBrowser(
            this.platformId
            )

        ) {

            return;

        }

        const idNivel = Number(

            localStorage.getItem(
            'id_nivel'
            )

        );

        this.temaService
            .obtenerTemas(
            idNivel
            )

            .subscribe({

            next: (data) => {

                console.log(
                'Temas:',
                data
                );

                this.temas =
                data;

            },

            error: (error) => {

                console.error(
                'Error cargando temas:',
                error
                );

            }

            });

  }

  seleccionarTema(
    tema: any
    ): void {

    if (

        isPlatformBrowser(
        this.platformId
        )

    ) {

        localStorage.setItem(

        'nombre_tema',

        tema.nombre_tema

        );

    }

    this.quizConfigService
        .setTema(

        tema.id_tema

        );

    this.router.navigate([

        '/seleccionar-dificultad'

    ]);

  }

  toggleMenu(): void {

    this.menuAbierto =

      !this.menuAbierto;

  }

  volver(): void {

    this.router.navigate([

      '/seleccionar-modalidad'

    ]);

  }

}
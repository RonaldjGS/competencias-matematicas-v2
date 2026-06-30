import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
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
  TemaService
} from '../../../services/tema.service';

@Component({
  selector:
    'app-seleccionar-tema',

  standalone: true,

  imports: [
    CommonModule,
    TopbarEstudianteComponent,
    
    SidebarEstudianteComponent
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

    private cdr: ChangeDetectorRef,

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
    this.refrescarVista();

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

        this.temaService
            .obtenerTemas(
            idNivel,
            idEstudiante,
            idCompetencia,
            idSubmodulo
            )

            .subscribe({

            next: (data) => {

                 console.log("TEMAS COMPLETOS");
                  console.table(data);

                this.temas =
                data;

                this.refrescarVista();

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
        'id_tema',
        tema.id_tema
      );

        localStorage.setItem(

        'nombre_tema',

        tema.nombre_tema

        );

    }

    this.quizConfigService
        .setTema(

        tema.id_tema

        );

    this.quizConfigService
      .setNombreTema(
        tema.nombre_tema
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

   private refrescarVista(): void {

      this.cdr.detectChanges();

  }

  obtenerIconoTema(
    nombreTema: string
  ): string {

      if (!nombreTema) {

          return 'bi bi-book';

      }

      const tema = nombreTema
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

      if (tema.includes('algebra')) {

          return 'bi bi-calculator';

      }

      if (tema.includes('geometr')) {

          return 'bi bi-rulers';

      }

      if (tema.includes('estad')) {

          return 'bi bi-bar-chart-fill';

      }

      return 'bi bi-book';

  }

  obtenerClaseResultado(
    porcentaje: number | null
  ): string {

      if (

          porcentaje == null

      ) {

          return '';

      }

      if (

          porcentaje >= 80

      ) {

          return 'resultado-verde';

      }

      if (

          porcentaje >= 60

      ) {

          return 'resultado-naranja';

      }
      return 'resultado-morado';

  }

  obtenerClaseBoton(
    nombreTema: string
  ): string {

      const tema = nombreTema
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g,'');

      if (tema.includes('algebra')) {

          return 'btn-verde';

      }

      if (tema.includes('geometr')) {

          return 'btn-naranja';

      }

      if (tema.includes('estad')) {

          return 'btn-morado';

      }

      return 'btn-morado';

  }

  obtenerClaseBadge(
    nombreTema:string
  ):string{

      const tema = nombreTema
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g,'');

      if(tema.includes('algebra')){

          return 'badge-verde';

      }

      if(tema.includes('geometr')){

          return 'badge-naranja';

      }

      if(tema.includes('estad')){

          return 'badge-azul';

      }

      return 'badge-verde';

  }

}
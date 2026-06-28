import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  AfterViewInit
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

import {
  TopbarEstudianteComponent
} from '../../../components/topbar-estudiante/topbar-estudiante.component';

import {
  SidebarEstudianteComponent
} from '../../../components/sidebar-estudiante/sidebar-estudiante.component';


import {
  DashboardEstudianteService
} from '../../../services/dashboard-estudiante.service';

@Component({
  selector:
    'app-seleccionar-modalidad',

  standalone: true,

  imports: [
    CommonModule,
    
    TopbarEstudianteComponent,

    SidebarEstudianteComponent
  ],

  templateUrl:
    './seleccionar-modalidad.component.html',

  styleUrl:
    './seleccionar-modalidad.component.css'
})

export class SeleccionarModalidadComponent
implements OnInit, AfterViewInit {

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

    private dashboardService:
    DashboardEstudianteService,

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
        ) || 'Estudiante';

      this.nombreModulo =

        localStorage.getItem(
          'nombre_nivel'
        ) ||

        'Entrenamiento Matemático';

    }

    const idEstudiante = Number(

        localStorage.getItem(
            'id_estudiante'
        )

    );

    this.cargarResumen(
        idEstudiante
    );

    
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

            this.refrescarVista();

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

  ngAfterViewInit(): void {

    setTimeout(() => {

        this.refrescarVista();

    });

  }

  cargarResumen(
      idEstudiante: number
  ): void {

      this.dashboardService
      .obtenerResumen(idEstudiante)
      .subscribe({

          next: (data) => {

              this.precisionPromedio =
                  `${data.porcentaje_aciertos} %`;

              this.evaluacionesRealizadas =
                  data.evaluaciones_realizadas;

              this.tiempoPromedio =

                    data.tiempo_promedio != null

                    ? this.formatearTiempo(
                        data.tiempo_promedio
                      )

                    : '--';

              this.refrescarVista();

          },

          error: (err) => {

              console.error(err);

          }

      });

  }

  private refrescarVista(): void {

      this.cdr.detectChanges();

  }

  formatearTiempo(segundos: number): string {

      const minutos = Math.floor(segundos / 60);

      const restoSegundos = segundos % 60;

      if (minutos > 0) {

          return `${minutos} min ${restoSegundos} s`;

      }

      return `${restoSegundos} s`;

  }

}
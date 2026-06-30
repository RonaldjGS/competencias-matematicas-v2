import {
  Component,
  OnInit,
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
  CompetenciaService
} from '../../../services/competencia.service';

import {
  QuizConfigService
} from '../../../services/quiz-config.service';

import { TopbarEstudianteComponent } from '../../../components/topbar-estudiante/topbar-estudiante.component';

import { SidebarEstudianteComponent } from '../../../components/sidebar-estudiante/sidebar-estudiante.component';

import { ChangeDetectorRef } from '@angular/core';

import {
  DashboardEstudianteService
} from '../../../services/dashboard-estudiante.service';

import {
  PLATFORM_ID,
  inject
} from '@angular/core';

@Component({
  selector:
    'app-seleccionar-competencia',

  standalone: true,

  imports: [
    CommonModule,

    TopbarEstudianteComponent,
  
    SidebarEstudianteComponent
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

    private dashboardService:
    DashboardEstudianteService,

    private quizConfigService:
    QuizConfigService,

    private cdr: ChangeDetectorRef

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

    this.cargarResumen();

  }

  cargarCompetencias(): void {

    this.competenciaService
      .obtenerCompetencias()
      .subscribe({

        next: (data) => {

          this.competencias =
            data;

          this.refrescarVista();

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

  cargarResumen(): void {

      const idEstudiante = Number(

          localStorage.getItem(
              'id_estudiante'
          )

      );

      this.dashboardService
          .obtenerResumen(idEstudiante)
          .subscribe({

              next: (data) => {

                  this.precisionPromedio =

                      data.porcentaje_aciertos != null
                      ? data.porcentaje_aciertos + ' %'
                      : '--';

                  this.tiempoPromedio =

                    data.tiempo_promedio != null

                    ? this.formatearTiempo(
                        data.tiempo_promedio
                      )

                    : '--';

                  this.evaluacionesRealizadas =

                      data.evaluaciones_realizadas
                      ?? '--';

                  this.refrescarVista();

              },

              error: (error) => {

                  console.error(
                      'Error cargando resumen',
                      error
                  );

              }

          });

  }

  seleccionarCompetencia(
    competencia: any
  ): void {

    if (

      isPlatformBrowser(
        this.platformId
      )

    ) {

      localStorage.setItem(

        'id_competencia',

        competencia.id_competencia
          .toString()

      );

      localStorage.setItem(

        'nombre_competencia',

        competencia.nombre_competencia

      );

    }

    this.quizConfigService
      .setCompetencia(
        competencia.id_competencia
      );

    this.quizConfigService
      .setNombreCompetencia(
        competencia.nombre_competencia
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

  ngAfterViewInit(): void{

      setTimeout(()=>{

          this.cdr.detectChanges();

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

  obtenerClaseCompetencia(
    nombre: string
  ): string {

      const texto = nombre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g,'');

      if (texto.includes('razonamiento')) {

          return 'competencia-morada';

      }

      if (texto.includes('comunicacion')) {

          return 'competencia-verde';

      }

      if (texto.includes('conexiones')) {

          return 'competencia-naranja';

      }

      return 'competencia-azul';

  }

  

}
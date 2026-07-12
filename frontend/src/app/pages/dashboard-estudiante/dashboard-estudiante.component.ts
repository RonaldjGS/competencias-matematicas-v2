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

import { TopbarEstudianteComponent } from '../../components/topbar-estudiante/topbar-estudiante.component';

import { SidebarEstudianteComponent } from '../../components/sidebar-estudiante/sidebar-estudiante.component';

import {

  DashboardEstudianteService

} from '../../services/dashboard-estudiante.service';

import {

  ChangeDetectorRef

} from '@angular/core';

@Component({
  selector: 'app-dashboard-estudiante',
  standalone: true,
  imports: [
    CommonModule,

    TopbarEstudianteComponent,

    SidebarEstudianteComponent
  ],

  

  templateUrl:
    './dashboard-estudiante.component.html',

  styleUrl:
    './dashboard-estudiante.component.css'
})
export class DashboardEstudianteComponent
implements OnInit {

  nombreEstudiante = '';

  idNivel = 0;

  idEstudiante = 0;

  tituloModulo = '';

  descripcionModulo = '';

  menuAbierto = false;

  ejerciciosCompletados:
  number | null = null;

  porcentajeAciertos:
  number | null = null;

  tiempoPromedio:
  string | null = null;

  evaluacionesRealizadas:
  number | null = null;

  ranking:any[]=[];

  miPosicion=0;

  actividades: any[] = [];

  constructor(

    private router: Router,

    private dashboardService: DashboardEstudianteService,

    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    this.nombreEstudiante =

      localStorage.getItem(
        'nombre_estudiante'
      ) || 'Estudiante';

    this.idNivel = Number(

      localStorage.getItem(
        'id_nivel'
      )

    );

    this.idEstudiante = Number(

      localStorage.getItem(

        'id_estudiante'

      )

    );

    this.configurarModulo();

    this.cargarResumen();

    this.cargarRanking();

    this.cargarActividadReciente();

  }

  configurarModulo(): void {

    switch (this.idNivel) {

      case 1:

        this.tituloModulo =
          'Bachillerato';

        this.descripcionModulo =
          'Entrenamiento para estudiantes de bachillerato';

      break;

      case 2:

        this.tituloModulo =
          'Nivelación y Admisión';

        this.descripcionModulo =
          'Entrenamiento orientado al curso de nivelación';

      break;

      case 3:

        this.tituloModulo =
          'Primer Semestre';

        this.descripcionModulo =
          'Entrenamiento para estudiantes universitarios';

      break;

      default:

        this.tituloModulo =
          'Competencias Matemáticas';

        this.descripcionModulo =
          '';

    }

  }

  cargarResumen(): void {

    this.dashboardService

      .obtenerResumen(

        this.idEstudiante

      )

      .subscribe({

        next: (resp) => {

          console.log(

            'RESUMEN DASHBOARD'

          );

          console.log(resp);

          this.ejerciciosCompletados =

            resp.ejercicios_completados;

          this.porcentajeAciertos =

            resp.porcentaje_aciertos != null

            ? Number(resp.porcentaje_aciertos.toFixed(1))

            : null;

          this.tiempoPromedio =

            resp.tiempo_promedio != null

            ? this.formatearTiempo(

                resp.tiempo_promedio

              )

            : null;

          this.evaluacionesRealizadas =

            resp.evaluaciones_realizadas;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  cargarRanking(){

    this.dashboardService

    .obtenerRanking(

        this.idEstudiante

    )

    .subscribe({

        next:(resp)=>{

            this.ranking=resp.top;

            this.miPosicion=resp.mi_posicion;

            this.cdr.detectChanges();

        },

        error:(err)=>{

            console.log(err);

        }

    });

}

cargarActividadReciente(){

    this.dashboardService

        .obtenerActividadReciente(

            this.idEstudiante

        )

        .subscribe({

            next:(respuesta)=>{

                this.actividades =

                    respuesta.actividades;

                this.cdr.detectChanges();

            },

            error:(error)=>{

                console.error(error);

            }

        });

}

  toggleMenu(): void {

    this.menuAbierto =
      !this.menuAbierto;

  }

  irSeleccionCompetencia(): void {

    this.router.navigate([
      '/seleccionar-competencia'
    ]);

  }

  cerrarSesion(): void {

    localStorage.clear();

    this.router.navigate([
      '/login-estudiante'
    ]);

  }

  formatearTiempo(segundos: number): string {

    if (segundos < 60) {

      return `${segundos} s`;

    }

    const minutos = Math.floor(

      segundos / 60

    );

    const resto = segundos % 60;

    return `${minutos} min ${resto} s`;

  }

}
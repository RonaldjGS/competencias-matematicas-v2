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

@Component({
  selector: 'app-dashboard-estudiante',
  standalone: true,
  imports: [
    CommonModule
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

  tituloModulo = '';

  descripcionModulo = '';

  menuAbierto = true;

  ejerciciosCompletados:
  number | null = null;

  porcentajeAciertos:
  number | null = null;

  tiempoPromedio:
  string | null = null;

  evaluacionesRealizadas:
  number | null = null;

  constructor(
  private router: Router
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

    this.configurarModulo();

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

  toggleMenu(): void {

    this.menuAbierto =
      !this.menuAbierto;

  }

  irSeleccionCompetencia(): void {

    this.router.navigate([
      '/seleccionar-competencia'
    ]);

  }

}
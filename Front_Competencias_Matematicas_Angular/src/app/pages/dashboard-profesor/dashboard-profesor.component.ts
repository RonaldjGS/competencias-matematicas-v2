import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';

import {
  PLATFORM_ID,
  inject
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  CommonModule
} from '@angular/common';

import {
  Chart
} from 'chart.js/auto';

import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-dashboard-profesor',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl:
    './dashboard-profesor.component.html',

  styleUrl:
    './dashboard-profesor.component.css'
})



export class DashboardProfesorComponent


implements OnInit, AfterViewInit {
  private platformId =
    inject(PLATFORM_ID);
  nombreProfesor = '';

  totalEstudiantes = 125;

  totalEvaluaciones = 480;

  precisionPromedio = 72;

  competenciaCritica =
    'Conexiones y Modelización';

  constructor(
  private router: Router
  ) {}
  ngAfterViewInit(): void {

    new Chart(
      'graficoCompetencias',
      {

        type: 'bar',

        data: {

          labels: [

            'Comunicación',

            'Razonamiento',

            'Resolución',

            'Conexiones'

          ],

          datasets: [

            {

              label:
              'Precisión (%)',

              data: [

                72,
                65,
                58,
                45

              ]

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false

        }

      }

    );

  }

  ngOnInit(): void {

  if (

    isPlatformBrowser(
      this.platformId
    )

  ) {

    this.nombreProfesor =

      localStorage.getItem(
        'nombre_profesor'
      ) || 'Profesor';

  }

}

  irPreguntas(): void {

    console.log('Navegando a preguntas');

    this.router.navigate([
      '/preguntas'
    ]);

  }

}
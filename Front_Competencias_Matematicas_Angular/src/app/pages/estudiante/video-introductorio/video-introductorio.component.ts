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

@Component({
  selector:
    'app-video-introductorio',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './video-introductorio.component.html',

  styleUrl:
    './video-introductorio.component.css'
})
export class VideoIntroductorioComponent
implements OnInit {

  nombreEstudiante = '';

  menuAbierto = false;

  configuracion: any = {};

  constructor(

    private router: Router,

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
        ) || 'Estudiante';

    }

    this.cargarDatos();

  }

  cargarDatos(): void {

    this.configuracion =

      this.quizConfigService
        .obtenerConfiguracion();

    console.log(
      'Configuración:',
      this.configuracion
    );

  }

  toggleMenu(): void {

    this.menuAbierto =
      !this.menuAbierto;

  }

  volver(): void {

    this.router.navigate([
      '/seleccionar-dificultad'
    ]);

  }

  iniciarQuiz(): void {

    this.router.navigate([
      '/quiz'
    ]);

  }

}
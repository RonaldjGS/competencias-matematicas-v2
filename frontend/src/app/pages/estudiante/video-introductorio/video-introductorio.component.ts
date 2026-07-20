import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  Router
} from '@angular/router';

import { TopbarEstudianteComponent } from '../../../components/topbar-estudiante/topbar-estudiante.component';

import { SidebarEstudianteComponent } from '../../../components/sidebar-estudiante/sidebar-estudiante.component';

import {
  QuizConfigService
} from '../../../services/quiz-config.service';

import {

  VideoEstudianteService

} from '../../../services/video-estudiante.service';

import {

    DomSanitizer,

    SafeResourceUrl

} from '@angular/platform-browser';

declare var YT: any;

@Component({
  selector:
    'app-video-introductorio',

  standalone: true,

  imports: [
    CommonModule,

    TopbarEstudianteComponent,
  
    SidebarEstudianteComponent
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

  videoIntro: any = null;

  idEstudiante = 0;

  cargandoVideo = false;

  videoNoDisponible = false;

  // =====================================
  // REPRODUCTOR YOUTUBE
  // =====================================

  player: any = null;

  videoFinalizado = false;

  apiYoutubeLista = false;

  

  constructor(

    private router: Router,

    private quizConfigService:
    QuizConfigService,

    private videoService:
    VideoEstudianteService,

    private sanitizer: DomSanitizer,

    @Inject(PLATFORM_ID)
    private platformId: Object,

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

      this.idEstudiante = Number(

        localStorage.getItem(

          'id_estudiante'

        )

      );

    }

    this.cargarDatos();

    this.cargarVideo();

  }

  cargarDatos(): void {

      this.configuracion =

          this.quizConfigService

              .obtenerConfiguracion();

      console.log(

          'Configuración:',

          this.configuracion

      );

      if (

          this.configuracion.idCompetencia &&

          this.configuracion.idSubmodulo &&

          this.configuracion.idTema

      ) {

          this.cargarVideo();

      }

      this.refrescarVista();

  }

  toggleMenu(): void {

    this.menuAbierto =
      !this.menuAbierto;

  }

  volver(): void {

    this.router.navigate([
      '/seleccionar-dificultad'
    ]);

    this.refrescarVista();

  }

  // =====================================
  // COMENZAR QUIZ
  // =====================================

  comenzarQuiz(): void {

      if (

          !this.videoIntro ||

          !this.videoFinalizado

      ) {

          return;

      }

      this.videoService

          .registrarVideoVisualizado(

              this.idEstudiante,

              this.videoIntro.id_video

          )

          .subscribe({

              next: () => {

                  console.log(

                      'Visualización registrada'

                  );

                  this.router.navigate([

                      '/quiz'

                  ]);

              },

              error: (error) => {

                  console.error(

                      error

                  );

              }

          });

  }

    cargarVideo(): void {

        this.cargandoVideo = true;

        this.videoNoDisponible = false;

        this.videoFinalizado = false;

        this.videoIntro = null;

        if (this.player) {

            this.player.destroy();

            this.player = null;

        }

        this.videoService

            .getVideoIntro(

                this.configuracion.idCompetencia,

                this.configuracion.idSubmodulo,

                this.configuracion.idTema

            )

            .subscribe({

                next: (respuesta: any) => {

                    this.videoIntro = respuesta;

                    this.cargandoVideo = false;

                    this.refrescarVista();

                    setTimeout(() => {

                        this.cargarApiYoutube();

                    }, 100);

                },

                error: (error) => {

                    console.error(error);

                    this.videoNoDisponible = true;

                    this.cargandoVideo = false;

                    this.refrescarVista();

                }

            });

    }

  // =====================================
  // CARGAR API DE YOUTUBE
  // =====================================

    cargarApiYoutube(): void {

        if (

            typeof YT !== 'undefined' &&

            YT.Player

        ) {

            this.apiYoutubeLista = true;

            this.crearReproductor();

            return;

        }

        let script = document.querySelector(

            'script[src="https://www.youtube.com/iframe_api"]'

        ) as HTMLScriptElement | null;

        if (!script) {

            script = document.createElement('script');

            script.src = 'https://www.youtube.com/iframe_api';

            document.body.appendChild(script);

        }

        (window as any).onYouTubeIframeAPIReady = () => {

            this.apiYoutubeLista = true;

            this.crearReproductor();

        };

    }

  // =====================================
  // CREAR REPRODUCTOR
  // =====================================

  crearReproductor(): void {

    console.log(
        'Creando reproductor...'
    );    
    
        if (!this.videoIntro) {

            return;

        }

        const contenedor = document.getElementById(

            'youtube-player'

        );

        if (!contenedor) {

            setTimeout(() => {

                this.crearReproductor();

            }, 100);

            return;

        }

        if (this.player) {

            this.player.destroy();

            this.player = null;

        }

        this.player = new YT.Player(

            'youtube-player',

            {

                width: '100%',

                height: '420',

                videoId: this.videoIntro.youtube_id,

                playerVars: {

                    rel: 0,

                    modestbranding: 1

                },

                events: {

                    onReady: () => {

                        console.log('Player listo');

                    },

                    onStateChange: (event: any) => {

                        this.cambioEstadoVideo(event);

                    }

                }

            }

        );

    }

  // =====================================
  // CAMBIO DE ESTADO DEL VIDEO
  // =====================================

  cambioEstadoVideo(

      event:any

  ):void{

      switch(

          event.data

      ){

          case YT.PlayerState.PLAYING:

              console.log(

                  'Video reproduciéndose'

              );

          break;

          case YT.PlayerState.PAUSED:

              console.log(

                  'Video pausado'

              );

          break;

          case YT.PlayerState.ENDED:

              console.log(

                  'Video finalizado'

              );

              this.videoFinalizado = true;

              this.refrescarVista();

          break;

      }

  }

  private refrescarVista(): void {

      this.cdr.detectChanges();

  }

  // =====================================
  // OMITIR RECURSO
  // =====================================

  omitirRecurso(): void {

      if (

          !this.videoIntro

      ) {

          this.router.navigate([

              '/quiz'

          ]);

          return;

      }

      this.videoService

          .registrarVideoOmitido(

              this.idEstudiante,

              this.videoIntro.id_video

          )

          .subscribe({

              next: () => {

                  this.router.navigate([

                      '/quiz'

                  ]);

              },

              error: (error) => {

                  console.error(

                      error

                  );

              }

          });

  }

}
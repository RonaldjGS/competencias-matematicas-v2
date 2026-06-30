import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
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
  QuizService
} from '../../../services/quiz.service';

import {
  ChangeDetectorRef
} from '@angular/core';


@Component({
  selector: 'app-quiz',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './quiz.component.html',

  styleUrl:
    './quiz.component.css'
})
export class QuizComponent
implements OnInit, OnDestroy {

  // =====================================
  // DATOS GENERALES
  // =====================================

  nombreEstudiante = '';

  nombreCompetencia = '';

  nombreSubmodulo = '';

  nombreDificultad = '';

  estadoPreguntas: string[] = [];

  // =====================================
  // QUIZ
  // =====================================

  preguntas: any[] = [];

  preguntaActual = 0;

  preguntaActualData: any = null;

  cargandoQuiz = true;

  respuestaSeleccionada = '';

  preguntaRespondida = false;

  quizFinalizado = false;

  // =====================================
  // TIEMPO
  // =====================================

  tiempoRestante = 0;

  tiempoInicioQuiz = 0;

  tiempoInicioPregunta = 0;

  tiempoPregunta = 0;

  minutos = '00';

  segundos = '00';

  intervalo: any;

  temporizadorActivo = false;

  // =====================================
  // INTENTOS
  // =====================================

  intentosRestantes = 3;

  idIntento = 0;

  // =====================================
  // RESPUESTA
  // =====================================

  mostrarModalError = false;

  mostrarExplicacion = false;

  respuestaCorrecta = '';

  respuestaIncorrecta = '';

  respuestasIncorrectas: string[] = [];

  justificacion = '';

  opcionesBloqueadas: string[] = [];

  // =====================================
  // RESULTADOS
  // =====================================

  respuestasUsuario: any[] = [];

  constructor(

    private router: Router,

    private cdr: ChangeDetectorRef,

    private quizConfigService:
    QuizConfigService,

    private quizService:
    QuizService,

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

      console.log(
        'LOCALSTORAGE COMPETENCIA',
        localStorage.getItem('id_competencia')
      );

      console.log(
        'LOCALSTORAGE SUBMODULO',
        localStorage.getItem('id_submodulo')
      );

      console.log(
        'LOCALSTORAGE TEMA',
        localStorage.getItem('id_tema')
      );

      console.log(
        'LOCALSTORAGE DIFICULTAD',
        localStorage.getItem('dificultad')
      );

    }

    this.cargarConfiguracion();

    this.cargarQuiz();

  }

  // =====================================
  // CONFIGURACION
  // =====================================

  cargarConfiguracion(): void {

    if (isPlatformBrowser(this.platformId)) {

      const idCompetencia =
        localStorage.getItem(
          'id_competencia'
        );

      const idSubmodulo =
        localStorage.getItem(
          'id_submodulo'
        );

      const idTema =
        localStorage.getItem(
          'id_tema'
        );

      const dificultad =
        localStorage.getItem(
          'dificultad'
        );

      this.quizConfigService
        .setCompetencia(
          Number(idCompetencia)
        );

      this.quizConfigService
        .setSubmodulo(
          Number(idSubmodulo)
        );

      this.quizConfigService
        .setTema(
          Number(idTema)
        );

      this.quizConfigService
        .setDificultad(
          dificultad || ''
        );

    }

    const config =
      this.quizConfigService
        .obtenerConfiguracion();

    this.nombreCompetencia =
      config.nombreCompetencia || '';

    this.nombreSubmodulo =
      config.nombreSubmodulo || '';

    this.nombreDificultad =
      config.dificultad || '';

    
      console.log(
        "TOKEN",
        localStorage.getItem("token_estudiante")
      );

  }

  // =====================================
  // QUIZ
  // =====================================

  

  generarQuiz(): void {

    console.log(
      'Generar Quiz'
    );

  }

  seleccionarRespuesta(
    opcion: string
    ): void {

      if (
        this.preguntaRespondida
      ) {
        return;
      }

      this.respuestaSeleccionada =
        opcion;

    }

   responderPregunta(): void {

    const datos={

      id_intento:

          this.idIntento,

      id_pregunta:

          this.preguntaActualObjeto.id_pregunta,

      respuesta:

          this.respuestaSeleccionada,

      numero_pregunta:

          this.preguntaActual + 1,

      tiempo_respuesta:

          this.tiempoPregunta

    }
    this.quizService
      .responderPregunta(datos)
      .subscribe({

        next: (resp) => {

          //console.log(resp);

          console.log("RESPUESTA COMPLETA");
          console.log(resp);
          console.log("puede_reintentar =", resp.puede_reintentar);

          this.intentosRestantes =
            resp.intentos_restantes;

          // ==========================
          // RESPUESTA CORRECTA
          // ==========================

          if (resp.correcta) {

            this.actualizarEstadoPregunta(
              'correcta'
            );
            
            this.preguntaRespondida = true;

            this.mostrarExplicacion = true;

            this.respuestaCorrecta =
              resp.respuesta_correcta;

            this.justificacion =
              resp.justificacion;

            this.refrescarVista();

            return;

          }

          // ==========================
          // PUEDE REINTENTAR
          // ==========================

          if (resp.puede_reintentar) {

            this.mostrarModalError = true;

            this.refrescarVista();

            return;

          }

          // ==========================
          // TERMINÓ LA PREGUNTA
          // ==========================

          this.actualizarEstadoPregunta(
            'incorrecta'
          );
          
          this.preguntaRespondida = true;

          this.mostrarExplicacion = true;

          this.respuestaCorrecta =
            resp.respuesta_correcta;

          this.respuestasIncorrectas.push(
            this.respuestaSeleccionada
          );

          this.justificacion =
            resp.justificacion;

          this.refrescarVista();
        },

        error: (err) => {

          console.error(err);

        }

      });

   }

  siguientePregunta(): void {

    if (
      !this.preguntaRespondida
    ) {

      if (
        !this.respuestaSeleccionada
      ) {

        alert(
          'Seleccione una respuesta'
        );

        return;

      }

      this.responderPregunta();

      return;

    }

    // =====================================
    // SIGUIENTE PREGUNTA
    // =====================================

    this.preguntaActual++;

    if (

        this.preguntaActual <

        this.estadoPreguntas.length

    ) {

        this.estadoPreguntas[
            this.preguntaActual
        ] = 'actual';

    }

    this.preguntaActualData =

        this.preguntas[

            this.preguntaActual

        ];

    this.respuestaSeleccionada =
      '';

    this.tiempoPregunta = 0;

    this.preguntaRespondida =
      false;

    this.mostrarExplicacion =
      false;

    this.respuestaCorrecta =
      '';

    this.respuestasIncorrectas = 
      [];

    this.justificacion =
      '';

    this.opcionesBloqueadas =
      [];
    
    this.refrescarVista();

  }

  // =====================================
  // FINALIZAR ÚLTIMA PREGUNTA
  // =====================================

  finalizarUltimaPregunta(): void {

    if (!this.preguntaRespondida) {

      if (!this.respuestaSeleccionada) {

        alert(
          'Seleccione una respuesta'
        );

        return;

      }

      this.responderPregunta();

      return;

    }

    this.finalizarQuiz();

  }

  // =====================================
  // FINALIZAR Quiz
  // =====================================

  finalizarQuiz(): void {

    // =====================================
    // DETENER TEMPORIZADOR
    // =====================================

    clearInterval(
        this.intervalo
    );

    this.temporizadorActivo =
        false;

    // =====================================
    // TIEMPO UTILIZADO
    // =====================================

    const tiempoUtilizado =

        this.tiempoInicioQuiz -

        this.tiempoRestante;

    // =====================================
    // DATOS DEL QUIZ
    // =====================================

    const datos = {

        id_intento:
            this.idIntento,

        tiempo_total:
            tiempoUtilizado

    };

    this.quizService
    .finalizarQuiz(datos)
    .subscribe({

        next: (resp: any) => {

            console.log(
                "RESULTADO",
                resp
            );

            // ===============================
            // DATOS DEL SUBMÓDULO
            // ===============================

            const datosSubmodulo = {

                id_estudiante: Number(

                    localStorage.getItem(
                        'id_estudiante'
                    )

                ),

                id_competencia: Number(

                    localStorage.getItem(
                        'id_competencia'
                    )

                ),

                id_submodulo: Number(

                    localStorage.getItem(
                        'id_submodulo'
                    )

                )

            };

            // ===============================
            // REGISTRAR SUBMÓDULO COMPLETADO
            // ===============================

            this.quizService
            .finalizarSubmodulo(
                datosSubmodulo
            )
            .subscribe({

                next: () => {

                    this.router.navigate([

                        '/resultado-quiz',

                        resp.id_resultado

                    ]);

                },

                error: (err) => {

                    console.error(
                        err
                    );

                    // Aunque falle el registro
                    // del submódulo, el resultado
                    // del quiz ya fue guardado.

                    this.router.navigate([

                        '/resultado-quiz',

                        resp.id_resultado

                    ]);

                }

            });

        },

        error: (err) => {

            console.error(
                err
            );

        }

    });

    this.refrescarVista();

}
  // =====================================
  // MODAL
  // =====================================

  reintentar(): void {

    this.mostrarModalError = false;

    this.preguntaRespondida = false;

    this.mostrarExplicacion = false;

    this.respuestaCorrecta = '';

    this.justificacion = '';

    const datos={

      id_intento:

          this.idIntento,

      id_pregunta:

          this.preguntaActualObjeto.id_pregunta,

      respuesta:

          this.respuestaSeleccionada,

      numero_pregunta:

          this.preguntaActual + 1,

      tiempo_respuesta:
      
          this.tiempoPregunta

    }

    this.quizService
      .reintentarPregunta(datos)
      .subscribe({

        next: (resp: any) => {

          console.log("RESPUESTA REINTENTO");
          console.log("ANTES");
          console.log("preguntaRespondida =", this.preguntaRespondida);
          console.log("mostrarExplicacion =", this.mostrarExplicacion);
          console.log(resp);

          this.intentosRestantes =
              resp.intentos_restantes;

          this.respuestasIncorrectas.push(
            this.respuestaSeleccionada
          );

          this.opcionesBloqueadas =
            resp.opciones_bloqueadas ?? [];  

          if (resp.ultimo_intento) {

            
            this.actualizarEstadoPregunta(
              'incorrecta'
            );

            this.preguntaRespondida = true;

            this.mostrarExplicacion = true;

            this.respuestaCorrecta =
              resp.respuesta_correcta;

            this.justificacion =
              resp.justificacion;

          }

          else {

            this.respuestaSeleccionada =
              '';

          }

          console.log("DESPUÉS");
          console.log("preguntaRespondida =", this.preguntaRespondida);
          console.log("mostrarExplicacion =", this.mostrarExplicacion);

          this.refrescarVista();

        }

      });

  }

  continuarSinIntento(): void {

    this.mostrarModalError = false;

    const datos = {

      id_intento:
          this.idIntento,

      id_pregunta:
          this.preguntaActualObjeto.id_pregunta,

      numero_pregunta:
          this.preguntaActual + 1,

      respuesta: 
          this.respuestaSeleccionada,

      tiempo_respuesta:
          this.tiempoPregunta

    };

    this.quizService
      .continuarPregunta(datos)
      .subscribe({

        next: (resp: any) => {

          this.actualizarEstadoPregunta(
            'incorrecta'
          );
          
          this.preguntaRespondida = true;

          this.mostrarExplicacion = true;

          this.respuestaCorrecta =
              resp.respuesta_correcta;

          this.justificacion =
              resp.justificacion;

          this.respuestasIncorrectas.push(
              this.respuestaSeleccionada
          );

          this.refrescarVista();

        }

      });

  }

  // =====================================
  // CARGAR QUIZ
  // =====================================

  cargarQuiz(): void {

    const config =

      this.quizConfigService
        .obtenerConfiguracion();


    const datos = {

      id_competencia:
        config.idCompetencia,

      id_submodulo:
        config.idSubmodulo,

      id_tema:
        config.idTema,

      dificultad:
        config.dificultad,

      cantidad_preguntas:
        10

    };

    console.log(
      'CONFIG COMPLETA'
    );

    console.log(config);

    console.log(
      'DATOS ENVIADOS'
    );

    console.log(datos);

    this.quizService

    
      .generarQuiz(datos)
      .subscribe({

        next: (response) => {

          // =============================
          // NUEVO ID DEL INTENTO
          // =============================

          this.idIntento =
            response.id_intento;

          // =============================
          // PREGUNTAS
          // =============================

          this.preguntas =
            response.preguntas;

          this.tiempoRestante =
            response.tiempo_segundos;

          this.tiempoInicioQuiz =
            response.tiempo_segundos;

          this.actualizarTiempo();


          this.iniciarTemporizador();

          this.estadoPreguntas =
            this.preguntas.map(() => 'sin_responder');

          this.estadoPreguntas[0] =
            'actual';

          console.log(
            'ID INTENTO',
            this.idIntento
          );

          console.log(
            'PREGUNTAS',
            this.preguntas
          );

          console.log(
            'TOTAL',
            this.preguntas.length
          );

          // =============================
          // PRIMERA PREGUNTA
          // =============================

          if (

            this.preguntas.length > 0

          ) {

            this.preguntaActual = 0;

            this.preguntaActualData =

              this.preguntas[0];

          }

          // =============================
          // ESTADO INICIAL
          // =============================

          this.respuestaSeleccionada =
            '';

          this.tiempoPregunta = 0;

          this.respuestaCorrecta =
            '';

          this.respuestaIncorrecta =
            '';

          this.preguntaRespondida =
            false;

          this.mostrarExplicacion =
            false;

          this.mostrarModalError =
            false;

          this.opcionesBloqueadas =
            [];

          this.cargandoQuiz =
            false;

          this.refrescarVista();

        },

        error: (error) => {

          console.error(
            'Error generando quiz',
            error
          );

          this.cargandoQuiz =
            false;

        }

      });

  }

  // =====================================
  // UTILIDADES
  // =====================================

  obtenerPreguntaActual(): any {

    return this.preguntas[
      this.preguntaActual
    ];

  }

  porcentajeProgreso(): number {

    if (

      this.preguntas.length === 0

    ) {

      return 0;

    }

    return (

      (
        this.preguntaActual + 1
      )

      /

      this.preguntas.length

    ) * 100;

  }

  esUltimaPregunta(): boolean {

    return (

      this.preguntaActual ===

      this.preguntas.length - 1

    );

  }

  get preguntaActualObjeto() {

    return this.preguntas[
      this.preguntaActual
    ];

  }

  // =====================================
  // REFRESCAR VISTA
  // =====================================

  private refrescarVista(): void {

    this.cdr.detectChanges();

  }

  // =====================================
  // ACTUALIZAR PROGRESO
  // =====================================

  private actualizarEstadoPregunta(
    estado: 'correcta' | 'incorrecta'
  ): void {

    this.estadoPreguntas[
      this.preguntaActual
    ] = estado;

  }

  // =====================================
  // ACTUALIZAR TIEMPO
  // =====================================

  actualizarTiempo(): void {

      const minutos =
          Math.floor(
              this.tiempoRestante / 60
          );

      const segundos =
          this.tiempoRestante % 60;

      this.minutos =
          minutos
          .toString()
          .padStart(2, '0');

      this.segundos =
          segundos
          .toString()
          .padStart(2, '0');

  }


  // =====================================
  // INICIAR TEMPORIZADOR
  // =====================================

  iniciarTemporizador(): void {

      clearInterval(
          this.intervalo
      );

      this.intervalo =
      setInterval(() => {

          if (

              this.tiempoRestante > 0

          ) {

              // ==========================
              // TIEMPO TOTAL DEL QUIZ
              // ==========================

              this.tiempoRestante--;

              // ==========================
              // TIEMPO DE LA PREGUNTA
              // ==========================

              this.tiempoPregunta++;

              // ==========================

              this.actualizarTiempo();

              this.refrescarVista();

          }

          else {

              clearInterval(
                  this.intervalo
              );

              this.temporizadorActivo =
                  false;

              this.finalizarPorTiempo();

          }

      }, 1000);

  }

  // =====================================
  // FINALIZAR POR TIEMPO
  // =====================================

  finalizarPorTiempo(): void {

      alert(
          'Se terminó el tiempo.'
      );  

  }

  // =====================================
  // DESTRUIR COMPONENTE
  // =====================================

  ngOnDestroy(): void {

    clearInterval(
      this.intervalo
    );

  }

}
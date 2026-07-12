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

  ChangeDetectorRef

} from '@angular/core';

import {

  SidebarEstudianteComponent

} from '../../../components/sidebar-estudiante/sidebar-estudiante.component';

import {

  TopbarEstudianteComponent

} from '../../../components/topbar-estudiante/topbar-estudiante.component';

import {

  EstudianteProfesorService

} from '../../../services/estudiante-profesor.service';

import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-historial-estudiante',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    SidebarEstudianteComponent,

    TopbarEstudianteComponent

  ],

  templateUrl: './historial-estudiante.component.html',

  styleUrl: './historial-estudiante.component.css'

})

export class HistorialEstudianteComponent implements OnInit {

  // =====================================
  // TOPBAR Y SIDEBAR
  // =====================================

  nombreEstudiante = '';

  menuAbierto = false;

  // =====================================
  // DATOS DEL ESTUDIANTE
  // =====================================

  idEstudiante!: number;

  // =====================================
  // HISTORIAL
  // =====================================

  historialEvaluaciones: any[] = [];

  detalleHistorial: any[] = [];

  evaluacionSeleccionada: number | null = null;

  preguntaAbierta: number | null = null;

  cargando = false;

  totalEvaluaciones = 0;

  mejorPuntaje = 0;

  tiempoPromedio = '--';

  historialPaginado: any[] = [];

  paginaActual = 1;

  elementosPorPagina = 10;

  totalPaginas = 0;

  paginas: number[] = [];

 historialOriginal:any[]=[];

 competencias:string[]=[];

 submodulos:string[]=[];

 temas:string[]=[];

 competenciaSeleccionada='';

 submoduloSeleccionado='';

 temaSeleccionado='';

  constructor(

    private estudianteProfesorService: EstudianteProfesorService,

    private cdr: ChangeDetectorRef,

    @Inject(PLATFORM_ID)

    private platformId: Object

  ){}

  ngOnInit(): void {

    if(

      isPlatformBrowser(

        this.platformId

      )

    ){

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

    this.cargarHistorial();

  }

  // =====================================
  // HISTORIAL
  // =====================================

  cargarHistorial(): void {

    this.cargando = true;

    this.estudianteProfesorService

    .obtenerHistorialEvaluaciones(

      this.idEstudiante

    )

    .subscribe({

      next:(data:any[])=>{

        this.historialEvaluaciones = data;

        this.calcularResumen();

        this.paginaActual = 1;

        this.actualizarPaginacion();

        this.historialOriginal = data;

        this.historialEvaluaciones = [...data];

        this.cargarCompetencias();

        this.cargando = false;

        this.refrescarVista();

        console.log(

          this.historialEvaluaciones

        );

      },

      error:(error)=>{

        console.error(

          error

        );

        this.cargando = false;

      }

    });

  }

  // =====================================
  // DETALLE
  // =====================================

  verDetalle(

    intento:any

  ):void{

    if(

      this.evaluacionSeleccionada===

      intento.id_resultado

    ){

      this.cerrarDetalle();

      return;

    }

    this.evaluacionSeleccionada=

    intento.id_resultado;

    this.cargarDetalle(

      intento.id_resultado

    );

  }

  cargarDetalle(

    idResultado:number

  ):void{

    this.estudianteProfesorService

    .obtenerDetalleHistorial(

      idResultado

    )

    .subscribe({

      next:(data:any[])=>{

        this.detalleHistorial=data;

        this.preguntaAbierta=null;

        this.refrescarVista();

      },

      error:(error)=>{

        console.error(

          error

        );

      }

    });

  }

  cerrarDetalle():void{

    this.evaluacionSeleccionada=null;

    this.detalleHistorial=[];

    this.preguntaAbierta=null;

  }

  // =====================================
  // PREGUNTAS
  // =====================================

  togglePregunta(

    numeroPregunta:number

  ):void{

    if(

      this.preguntaAbierta===

      numeroPregunta

    ){

      this.preguntaAbierta=null;

      return;

    }

    this.preguntaAbierta=

    numeroPregunta;

  }

  // =====================================
  // REFRESCAR
  // =====================================

  private refrescarVista():void{

    this.cdr.detectChanges();

  }

  // =====================================
    // ACTUALIZAR PAGINACIÓN
    // =====================================

    actualizarPaginacion(): void {

        this.totalPaginas = Math.ceil(

            this.historialEvaluaciones.length /

            this.elementosPorPagina

        );

        const inicio =

            (this.paginaActual - 1)

            *

            this.elementosPorPagina;

        const fin =

            inicio +

            this.elementosPorPagina;

        this.historialPaginado =

            this.historialEvaluaciones.slice(

                inicio,

                fin

            );

        this.paginas = Array(

            this.totalPaginas

        )

        .fill(0)

        .map(

            (_, index) => index + 1

        );

    }

    // =====================================
    // PÁGINA ANTERIOR
    // =====================================

    paginaAnterior(): void {

        if (

            this.paginaActual > 1

        ) {

            this.paginaActual--;

            this.actualizarPaginacion();

        }

    }

    // =====================================
    // PÁGINA SIGUIENTE
    // =====================================

    paginaSiguiente(): void {

        if (

            this.paginaActual < this.totalPaginas

        ) {

            this.paginaActual++;

            this.actualizarPaginacion();

        }

    }

    // =====================================
    // IR A PÁGINA
    // =====================================

    irPagina(

        pagina:number

    ):void{

        this.paginaActual = pagina;

        this.actualizarPaginacion();

    }

    calcularResumen(): void {

        this.totalEvaluaciones = this.historialEvaluaciones.length;

        if (this.historialEvaluaciones.length === 0) {

            this.mejorPuntaje = 0;

            this.tiempoPromedio = '--';

            return;

        }

        // Mejor puntaje

        this.mejorPuntaje = Math.max(

            ...this.historialEvaluaciones.map(

                (x:any)=>x.porcentaje

            )

        );

        // Tiempo promedio

        const totalTiempo = this.historialEvaluaciones.reduce(

            (sum:number,item:any)=>

                sum + item.tiempo_segundos,

            0

        );

        const promedio = Math.round(

            totalTiempo /

            this.historialEvaluaciones.length

        );

        this.tiempoPromedio =

            this.formatearTiempo(

                promedio

            );
        
        this.refrescarVista();

    }

    // =====================================
    // FORMATEAR TIEMPO
    // =====================================

    formatearTiempo(
        segundos: number
    ): string {

        const minutos = Math.floor(
            segundos / 60
        );

        const resto = segundos % 60;

        if (minutos === 0) {

            return `${resto} s`;

        }

        return `${minutos} min ${resto.toString().padStart(2,'0')} s`;

    }

    cargarCompetencias():void{

        this.competencias = [

            ...new Set(

                this.historialOriginal.map(

                    item => item.competencia

                )

            )

        ];

    }

    filtrarCompetencia():void{

        this.submoduloSeleccionado='';

        this.temaSeleccionado='';

        this.temas=[];

        if(

            this.competenciaSeleccionada===''

        ){

            this.submodulos=[];

            this.aplicarFiltros();

            return;

        }

        this.submodulos=[

            ...new Set(

                this.historialOriginal

                .filter(

                    item=>

                    item.competencia===

                    this.competenciaSeleccionada

                )

                .map(

                    item=>item.submodulo

                )

            )

        ];

        this.aplicarFiltros();

    }

    filtrarSubmodulo():void{

        this.temaSeleccionado='';

        if(

            this.submoduloSeleccionado===''

        ){

            this.temas=[];

            this.aplicarFiltros();

            return;

        }

        this.temas=[

            ...new Set(

                this.historialOriginal

                .filter(

                    item=>

                    item.competencia===

                    this.competenciaSeleccionada

                    &&

                    item.submodulo===

                    this.submoduloSeleccionado

                )

                .map(

                    item=>item.tema

                )

            )

        ];

        this.aplicarFiltros();

    }

    aplicarFiltros():void{

        this.historialEvaluaciones =

        this.historialOriginal.filter(

            item=>{

                const competencia =

                    !this.competenciaSeleccionada ||

                    item.competencia===

                    this.competenciaSeleccionada;

                const submodulo =

                    !this.submoduloSeleccionado ||

                    item.submodulo===

                    this.submoduloSeleccionado;

                const tema =

                    !this.temaSeleccionado ||

                    item.tema===

                    this.temaSeleccionado;

                return (

                    competencia &&

                    submodulo &&

                    tema

                );

            }

        );

        this.paginaActual = 1;

        this.actualizarPaginacion();

    }

    limpiarFiltros():void{

        this.competenciaSeleccionada='';

        this.submoduloSeleccionado='';

        this.temaSeleccionado='';

        this.submodulos=[];

        this.temas=[];

        this.historialEvaluaciones=[

            ...this.historialOriginal

        ];

        this.paginaActual=1;

        this.actualizarPaginacion();

    }



}
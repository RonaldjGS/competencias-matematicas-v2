import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
    CatalogosService
} from '../../../services/catalogos.service';

import {
  PreguntasService
} from '../../../services/preguntas.service';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-importar-preguntas',
  standalone: true,
  
  imports: [
    CommonModule,

    FormsModule
  ],

  templateUrl: './importar-preguntas.component.html',
  styleUrl: './importar-preguntas.component.css'
})
export class ImportarPreguntasComponent
implements OnInit {

  //==========================================
  // DATOS
  //==========================================

  
  competencias: any[] = [];

  submodulos: any[] = [];

  temas: any[] = [];

  //==========================================
  // SELECCIONES
  //==========================================

  competenciaSeleccionada:
  number | null = null;

  submoduloSeleccionado:
  number | null = null;

  temaSeleccionado:
  number | null = null;

  archivoExcel:
  File | null = null;

  preguntasImportadas = 0;

  preguntasRechazadas = 0;

  totalPreguntas = 0;

  estadoImportacion = '';

  mensajeResultado = '';

  tituloResultado = '';

  erroresImportacion:any[] = [];

  //==========================================
  // WIZARD
  //==========================================

  pasoActual = 1;

  tituloPaso = '';

  descripcionPaso = '';

  dragActivo = false;

  wizardBloqueado = false;



  private pasos = [

    {

      titulo:
      'Selecciona la competencia',

      descripcion:
      'Elige la competencia a la que pertenecen las preguntas.'

    },

    {

      titulo:
      'Selecciona el submódulo',

      descripcion:
      'Selecciona la modalidad en la que se utilizarán las preguntas.'

    },

    {

      titulo:
      'Selecciona el tema',

      descripcion:
      'Selecciona el tema correspondiente a las preguntas.'

    },

    {

      titulo:
      'Selecciona el archivo',

      descripcion:
      'Carga el archivo Excel que contiene las preguntas.'

    },

    {

      titulo:
      'Validación',

      descripcion:
      'Revisa el resultado de la importación.'

    }

  ];

  //==========================================
  // BARRA DE PROGRESO
  //==========================================

  pasosWizard = [

    {
      numero:1,
      nombre:'Competencia'
    },

    {
      numero:2,
      nombre:'Submódulo'
    },

    {
      numero:3,
      nombre:'Tema'
    },

    {
      numero:4,
      nombre:'Archivo'
    },

    {
      numero:5,
      nombre:'Validación'
    }

  ];

  constructor(

    private catalogosService:
    CatalogosService,

    private cdr:ChangeDetectorRef,

    private preguntasService:
    PreguntasService

  ) {
    console.log(
      'ImportarPreguntasComponent creado'
    );
  }

  //==========================================
  // INIT
  //==========================================

  ngOnInit(): void {

    this.cargarCompetencias();

    this.cargarSubmodulos();

    this.cargarTemas();

    this.actualizarCabeceraPaso();

  }

  //==========================================
  // CABECERA DEL WIZARD
  //==========================================

  private actualizarCabeceraPaso(): void {

    const paso =

      this.pasos[
        this.pasoActual - 1
      ];

    this.tituloPaso =
      paso.titulo;

    this.descripcionPaso =
      paso.descripcion;

  }

  private validarPaso(
    paso:number
  ): boolean {

      switch(paso){

          case 2:

              if(!this.competenciaSeleccionada){

                  Swal.fire({

                    icon:'warning',

                    title:'Competencia requerida',

                    text:'Debe seleccionar una competencia antes de continuar.',

                    confirmButtonColor:'#6f42c1'

                  });

                  return false;

              }

          break;

          case 3:

              if(!this.competenciaSeleccionada){

                  Swal.fire({

                    icon:'warning',

                    title:'Competencia requerida',

                    text:'Debe seleccionar una competencia antes de continuar.',

                    confirmButtonColor:'#6f42c1'

                  });

                  return false;

              }

              if(!this.submoduloSeleccionado){

                  Swal.fire({

                    icon:'warning',

                    title:'Submódulo requerido',

                    text:'Debe seleccionar un submódulo antes de continuar.',

                    confirmButtonColor:'#6f42c1'

                  });

                  return false;

              }

          break;

          case 4:

              if(!this.competenciaSeleccionada){

                  Swal.fire({

                    icon:'warning',

                    title:'Competencia requerida',

                    text:'Debe seleccionar una competencia antes de continuar.',

                    confirmButtonColor:'#6f42c1'

                  });

                  return false;

              }

              if(!this.submoduloSeleccionado){

                  Swal.fire({

                    icon:'warning',

                    title:'Submódulo requerido',

                    text:'Debe seleccionar un submódulo antes de continuar.',

                    confirmButtonColor:'#6f42c1'

                  });

                  return false;

              }

              if(!this.temaSeleccionado){

                  Swal.fire({

                    icon:'warning',

                    title:'Tema requerido',

                    text:'Debe seleccionar un tema antes de continuar.',

                    confirmButtonColor:'#6f42c1'

                  });

                  return false;

              }

          break;

          case 5:

              if(!this.archivoExcel){

                  Swal.fire({

                    icon:'warning',

                    title:'Archivo requerido',

                    text:'Debe seleccionar un archivo Excel antes de continuar.',

                    confirmButtonColor:'#6f42c1'

                  });

                  return false;

              }

          break;

      }

      return true;

  }

  irPaso(
    paso:number
  ): void {

      //======================================
      // WIZARD FINALIZADO
      //======================================

      if(

          this.wizardBloqueado

      ){

          return;

      }

      //======================================
      // VALIDAR AVANCE
      //======================================

      if(

          paso > this.pasoActual &&

          !this.validarPaso(paso)

      ){

          return;

      }

      //======================================
      // CAMBIAR PASO
      //======================================

      this.pasoActual = paso;

      this.actualizarCabeceraPaso();

  }

  volverPaso(): void {

    if(

      this.pasoActual > 1

    ){

      this.pasoActual--;

      this.actualizarCabeceraPaso();

    }

  }

  //==========================================
  // SELECCIÓN AUTOMÁTICA
  //==========================================

  seleccionarCompetencia(
    idCompetencia:number
  ): void {

    this.competenciaSeleccionada =
      idCompetencia;

    this.irPaso(2);

  }

  seleccionarSubmodulo(
    idSubmodulo:number
  ): void {

    this.submoduloSeleccionado =
      idSubmodulo;

    this.irPaso(3);

  }

  seleccionarTema(
    idTema:number
  ): void {

    this.temaSeleccionado =
      idTema;

    this.irPaso(4);

  }

  //==========================================
  // CATÁLOGOS
  //==========================================

  cargarCompetencias(): void {

    this.catalogosService
      .obtenerCompetencias()
      .subscribe({

        next:(data:any)=>{

          this.competencias =
            data;

          this.refrescarVista();

        },

        error:(error:any)=>{

          console.error(

            'Error cargando competencias',

            error

          );

        }

      });

  }

  cargarSubmodulos(): void {

    this.catalogosService
      .obtenerSubmodulos()
      .subscribe({

        next:(data:any)=>{

          this.submodulos =
            data;

          this.refrescarVista();

        },

        error:(error:any)=>{

          console.error(

            'Error cargando submódulos',

            error

          );

        }

      });

  }

  cargarTemas(): void {

    const idNivel = Number(

      localStorage.getItem(
        'id_nivel'
      )

    );

    this.catalogosService
      .obtenerTemasPorNivel(
        idNivel
      )
      .subscribe({

        next:(data:any)=>{

          this.temas =
            data;

          this.refrescarVista();

        },

        error:(error:any)=>{

          console.error(

            'Error cargando temas',

            error

          );

        }

      });

  }

  //==========================================
  // ARCHIVO
  //==========================================

  onFileSelected(
    event:any
  ): void {

      if(

          event.target.files &&
          event.target.files.length > 0

      ){

          this.procesarArchivo(

              event.target.files[0]

          );

      }

  }

  //==========================================
  // PROCESAR ARCHIVO
  //==========================================

  private procesarArchivo(
      archivo: File
  ): void {

      if(

          !archivo.name
              .toLowerCase()
              .endsWith('.xlsx')

      ){

          Swal.fire({

            icon:'warning',

            title:'Archivo no válido',

            text:'Solo se permiten archivos Excel (.xlsx).',

            confirmButtonColor:'#6f42c1'

          });

          return;

      }

      this.archivoExcel = archivo;

      console.log(

          'Archivo seleccionado:',

          archivo.name

      );

  }

  //==========================================
  // DRAG & DROP
  //==========================================

  onDragOver(
    event: DragEvent
  ): void {

    event.preventDefault();

    this.dragActivo = true;

  }

  onDragLeave(
    event: DragEvent
  ): void {

    event.preventDefault();

    this.dragActivo = false;

  }

  onDrop(
    event: DragEvent
  ): void {

    event.preventDefault();

    this.dragActivo = false;

    if (

      event.dataTransfer &&
      event.dataTransfer.files.length > 0

    ) {

      const archivo =

        event.dataTransfer.files[0];

      this.procesarArchivo(
        archivo
      );

    }

  }

  //==========================================
  // IMPORTAR
  //==========================================

  importarPreguntas(): void {

      //======================================
      // VALIDAR DATOS
      //======================================

      if(

          !this.competenciaSeleccionada ||

          !this.submoduloSeleccionado ||

          !this.temaSeleccionado ||

          !this.archivoExcel

      ){

          Swal.fire({

            icon:'warning',

            title:'Información incompleta',

            text:'Debe completar todos los campos antes de importar.',

            confirmButtonColor:'#6f42c1'

          });

          return;

      }

      //======================================
      // LIMPIAR RESULTADOS ANTERIORES
      //======================================

      this.totalPreguntas = 0;

      this.preguntasImportadas = 0;

      this.preguntasRechazadas = 0;

      this.estadoImportacion = '';

      this.tituloResultado = '';

      this.mensajeResultado = '';

      this.erroresImportacion = [];

      //======================================
      // CREAR FORMDATA
      //======================================

      const formData = new FormData();

      formData.append(

          'archivo',

          this.archivoExcel

      );

      //======================================
      // IMPORTAR
      //======================================

      this.preguntasService
          .importarExcel(

              formData,

              this.competenciaSeleccionada,

              this.submoduloSeleccionado,

              this.temaSeleccionado

          )
          .subscribe({

              next:(resp:any)=>{

                  console.log(resp);

                  //==============================
                  // RESULTADOS
                  //==============================

                  this.totalPreguntas =

                      resp.total_preguntas ?? 0;

                  this.preguntasImportadas =

                      resp.preguntas_importadas ?? 0;

                  this.preguntasRechazadas =

                      resp.preguntas_rechazadas ?? 0;

                  this.estadoImportacion =

                      resp.estado ?? '';

                  this.mensajeResultado =

                      resp.mensaje ?? '';

                  this.erroresImportacion =

                      resp.errores || [];

                  //==============================
                  // TÍTULO
                  //==============================

                  switch(this.estadoImportacion){

                      case 'exito':

                          this.tituloResultado =

                              '¡Importación completada con éxito!';

                      break;

                      case 'advertencia':

                          this.tituloResultado =

                              'Importación completada con observaciones';

                      break;

                      case 'error':

                          this.tituloResultado =

                              'No fue posible importar las preguntas';

                      break;

                      default:

                          this.tituloResultado =

                              'Resultado de la importación';

                  }

                  //==============================
                  // IR AL PASO 5
                  //==============================

                  this.irPaso(5);

                  this.wizardBloqueado = true;

                  this.refrescarVista();

                  switch(this.estadoImportacion){

                    case 'exito':

                        Swal.fire({

                            icon:'success',

                            title:'Importación completada',

                            text:this.mensajeResultado,

                            confirmButtonColor:'#6f42c1'

                        });

                    break;

                    case 'advertencia':

                        Swal.fire({

                            icon:'warning',

                            title:'Importación completada con observaciones',

                            text:this.mensajeResultado,

                            confirmButtonColor:'#6f42c1'

                        });

                    break;

                    case 'error':

                        Swal.fire({

                            icon:'error',

                            title:'No fue posible importar las preguntas',

                            text:this.mensajeResultado,

                            confirmButtonColor:'#6f42c1'

                        });

                    break;

                  }

                this.actualizarCabeceraPaso();

              },

              error:(error:any)=>{

                console.error(error);

                this.estadoImportacion = 'error';

                this.tituloResultado =

                    'Error durante la importación';

                this.mensajeResultado =

                    error.error?.detail ||

                    'Ocurrió un error inesperado.';

                this.irPaso(5);

                this.wizardBloqueado = true;

                this.refrescarVista();

                Swal.fire({

                  icon:'error',

                  title:'Error durante la importación',

                  text:this.mensajeResultado,

                  confirmButtonColor:'#6f42c1'

                });

                this.totalPreguntas = 0;

                this.preguntasImportadas = 0;

                this.preguntasRechazadas = 0;

                this.erroresImportacion = [];

              }

          });

  }

  private refrescarVista():void{

    this.cdr.detectChanges();

  }

  reiniciarImportacion(): void{

    this.competenciaSeleccionada = null;

    this.submoduloSeleccionado = null;

    this.temaSeleccionado = null;

    this.archivoExcel = null;

    this.preguntasImportadas = 0;

    this.preguntasRechazadas = 0;

    this.wizardBloqueado = false;

    this.irPaso(1);

  }

  //==========================================
  // DESCARGAR PLANTILLA
  //==========================================

  descargarPlantilla():void{

      this.preguntasService

          .descargarPlantilla()

          .subscribe({

              next:(archivo)=>{

                  const url =

                      window.URL.createObjectURL(

                          archivo

                      );

                  const enlace =

                      document.createElement('a');

                  enlace.href = url;

                  const competencia =

                      this.competencias.find(

                          c =>

                          c.id_competencia ===

                          this.competenciaSeleccionada

                      );

                  const submodulo =

                      this.submodulos.find(

                          s =>

                          s.id_submodulo ===

                          this.submoduloSeleccionado

                      );

                  const tema =

                      this.temas.find(

                          t =>

                          t.id_tema ===

                          this.temaSeleccionado

                      );

                  const nombreArchivo =

                      `Plantilla_${
                          this.limpiarNombreArchivo(
                              competencia?.nombre_competencia ?? 'Competencia'
                          )
                      }_${
                          this.limpiarNombreArchivo(
                              submodulo?.nombre_submodulo ?? 'Submodulo'
                          )
                      }_${
                          this.limpiarNombreArchivo(
                              tema?.nombre_tema ?? 'Tema'
                          )
                      }.xlsx`;

                  enlace.download =

                      nombreArchivo;

                  enlace.click();

                  window.URL.revokeObjectURL(

                      url

                  );

              },

              error:(error)=>{

                  console.error(error);

                    Swal.fire({

                    icon:'error',

                    title:'Error',

                    text:'No fue posible descargar la plantilla.',

                    confirmButtonColor:'#6f42c1'

                  });

              }

          });

  }

  private limpiarNombreArchivo(
    texto: string
  ): string {

      return texto

          .normalize('NFD')

          .replace(/[\u0300-\u036f]/g, '')

          .replace(/\s+/g, '_')

          .replace(/[^\w]/g, '');

  }

}
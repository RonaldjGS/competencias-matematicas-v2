import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  CatalogosService
} from '../../services/catalogos.service';

import {
  PreguntasService
} from '../../services/preguntas.service';

@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.css'
})
export class PreguntasComponent
implements OnInit {

  // ==========================================
  // COMBOS
  // ==========================================

  competencias: any[] = [];

  submodulos: any[] = [];

  temas: any[] = [];

  // ==========================================
  // FILTROS
  // ==========================================

  competenciaSeleccionada:
  number | null = null;

  submoduloSeleccionado:
  number | null = null;

  temaSeleccionado:
  number | null = null;

  // ==========================================
  // ARCHIVO
  // ==========================================

  archivoExcel:
  File | null = null;

  constructor(

    private catalogosService:
    CatalogosService,

    private preguntasService:
    PreguntasService
  ) {}

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.cargarCompetencias();

    this.cargarSubmodulos();

    this.cargarTemas();

  }

  // ==========================================
  // COMPETENCIAS
  // ==========================================

  cargarCompetencias(): void {

    this.catalogosService
      .obtenerCompetencias()
      .subscribe({

        next: (data: any) => {

          this.competencias = data;

        },

        error: (error: any) => {

          console.error(
            'Error cargando competencias',
            error
          );

        }

      });

  }

  // ==========================================
  // SUBMODULOS
  // ==========================================

  cargarSubmodulos(): void {

    this.catalogosService
      .obtenerSubmodulos()
      .subscribe({

        next: (data: any) => {

          this.submodulos = data;

        },

        error: (error: any) => {

          console.error(
            'Error cargando submódulos',
            error
          );

        }

      });

  }

  // ==========================================
  // TEMAS
  // ==========================================

  cargarTemas(): void {

    this.catalogosService
      .obtenerTemas()
      .subscribe({

        next: (data: any) => {

          this.temas = data;

        },

        error: (error: any) => {

          console.error(
            'Error cargando temas',
            error
          );

        }

      });

  }

  // ==========================================
  // ARCHIVO EXCEL
  // ==========================================

  onFileSelected(
    event: any
  ): void {

    if (

        event.target.files &&
        event.target.files.length > 0

    ) {

        const archivo =
            event.target.files[0];

        this.archivoExcel =
            archivo;

        console.log(
            'Archivo seleccionado:',
            archivo.name
        );

    }   

  }

  // ==========================================
  // IMPORTAR
  // ==========================================

  importarPreguntas(): void {

  if (

    !this.competenciaSeleccionada ||

    !this.submoduloSeleccionado ||

    !this.temaSeleccionado ||

    !this.archivoExcel

  ) {

    alert(
      'Debe completar todos los campos'
    );

    return;

  }

  const formData =
    new FormData();

  formData.append(

    'archivo',

    this.archivoExcel

  );

  this.preguntasService
    .importarExcel(

      formData,

      this.competenciaSeleccionada,

      this.submoduloSeleccionado,

      this.temaSeleccionado

    )
    .subscribe({

      next: (resp: any) => {

        console.log(resp);

        alert(

          `Importadas: ${resp.preguntas_importadas}
           Rechazadas: ${resp.preguntas_rechazadas}`

        );

      },

      error: (error: any) => {

        console.error(error);

      }

    });

  }

}
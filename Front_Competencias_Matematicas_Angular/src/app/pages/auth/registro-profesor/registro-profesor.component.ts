import {
  Component,
  OnInit
} from '@angular/core';

import Swal from 'sweetalert2';

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
  AuthProfesorService
} from '../../../services/auth-profesor.service';

import {
  Router
} from '@angular/router';


@Component({
  selector: 'app-registro-profesor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './registro-profesor.component.html',

  styleUrl:
    './registro-profesor.component.css'
})
export class RegistroProfesorComponent
implements OnInit {

  // ==========================================
  // DATOS FORMULARIO
  // ==========================================

  nombreProfesor = '';

  institucionEducativa = '';

  correo = '';

  password = '';

  // ==========================================
  // COMBOS
  // ==========================================

  niveles: any[] = [];

  carreras: any[] = [];

  tiposInstitucion: any[] = [];

  provincias: any[] = [];

  ciudades: any[] = [];

  // ==========================================
  // IDS SELECCIONADOS
  // ==========================================

  nivelSeleccionado = 0;

  idTipoInstitucion:
  number | null = null;

  idCarrera:
  number | null = null;

  idProvincia:
  number | null = null;

  idCiudad:
  number | null = null;

  // ==========================================
  // UI
  // ==========================================

  mostrarInstitucion = false;

  mostrarCarrera = false;

  mostrarPassword = false;

  constructor(

    private catalogosService:
    CatalogosService,

    private authService:
    AuthProfesorService,

    private router:
    Router

  ) {}

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.cargarNiveles();

    this.cargarCarreras();

    this.cargarTiposInstitucion();

    this.cargarProvincias();

  }

  // ==========================================
  // NIVELES
  // ==========================================

  cargarNiveles(): void {

    this.catalogosService
      .obtenerNiveles()
      .subscribe({

        next: (data: any) => {

          this.niveles = data;

        },

        error: (error) => {

          console.error(
            'Error cargando niveles',
            error
          );

        }

      });

  }

  // ==========================================
  // CARRERAS
  // ==========================================

  cargarCarreras(): void {

    this.catalogosService
      .obtenerCarreras()
      .subscribe({

        next: (data: any) => {

          this.carreras = data;

        },

        error: (error) => {

          console.error(
            'Error cargando carreras',
            error
          );

        }

      });

  }

  // ==========================================
  // TIPOS INSTITUCION
  // ==========================================

  cargarTiposInstitucion(): void {

    this.catalogosService
      .obtenerTiposInstitucion()
      .subscribe({

        next: (data: any) => {

          this.tiposInstitucion = data;

        },

        error: (error) => {

          console.error(
            'Error cargando tipos',
            error
          );

        }

      });

  }

  // ==========================================
  // PROVINCIAS
  // ==========================================

  cargarProvincias(): void {

    this.catalogosService
      .obtenerProvincias()
      .subscribe({

        next: (data: any) => {

          this.provincias = data;

        },

        error: (error) => {

          console.error(
            'Error cargando provincias',
            error
          );

        }

      });

  }

  // ==========================================
  // CIUDADES POR PROVINCIA
  // ==========================================

  onProvinciaChange(): void {

    if (!this.idProvincia) {

      this.ciudades = [];

      this.idCiudad = null;

      return;

    }

    this.catalogosService
      .obtenerCiudadesPorProvincia(
        this.idProvincia
      )
      .subscribe({

        next: (data: any) => {

          this.ciudades = data;

        },

        error: (error) => {

          console.error(
            'Error cargando ciudades',
            error
          );

        }

      });

  }

  // ==========================================
  // NIVEL EDUCATIVO
  // ==========================================

  onNivelChange(): void {

    this.mostrarInstitucion = false;

    this.mostrarCarrera = false;

    this.idTipoInstitucion = null;

    this.idCarrera = null;

    if (
      this.nivelSeleccionado === 1
    ) {

      this.mostrarInstitucion = true;

    }

    if (
      this.nivelSeleccionado === 2 ||
      this.nivelSeleccionado === 3
    ) {

      this.mostrarCarrera = true;

    }

  }

  // ==========================================
  // MOSTRAR PASSWORD
  // ==========================================

  togglePassword(): void {

    this.mostrarPassword =
      !this.mostrarPassword;

  }
    irLoginProfesor(): void {

    this.router.navigate([
        '/login-profesor'
    ]);
    }

  registrarProfesor(): void {

  // ==========================================
  // VALIDACIONES GENERALES
  // ==========================================

  if (

    !this.nombreProfesor ||

    !this.institucionEducativa ||

    !this.correo ||

    !this.password ||

    !this.idCiudad ||

    this.nivelSeleccionado === 0

  ) {

    Swal.fire({

      icon: 'warning',

      title: 'Campos incompletos',

      text:
        'Debe completar toda la información requerida.'

    });

    return;

  }

  // ==========================================
  // VALIDAR TIPO INSTITUCIÓN
  // ==========================================

  if (

    this.mostrarInstitucion &&

    !this.idTipoInstitucion

  ) {

    Swal.fire({

      icon: 'warning',

      title: 'Campo requerido',

      text:
        'Debe seleccionar el tipo de institución.'

    });

    return;

  }

  // ==========================================
  // VALIDAR CARRERA
  // ==========================================

  if (

    this.mostrarCarrera &&

    !this.idCarrera

  ) {

    Swal.fire({

      icon: 'warning',

      title: 'Campo requerido',

      text:
        'Debe seleccionar una carrera.'

    });

    return;

  }

  // ==========================================
  // OBJETO A ENVIAR
  // ==========================================

  const datos = {

  nombre_profesor:
    this.nombreProfesor,

  institucion_educativa:
    this.institucionEducativa,

  id_nivel:
    this.nivelSeleccionado,

  id_tipo_institucion:
    this.idTipoInstitucion,

  id_carrera:
    this.idCarrera,

  id_provincia:
    this.idProvincia,

  id_ciudad:
    this.idCiudad,

  correo:
    this.correo,

  password:
    this.password

};
  console.log(
    'Datos enviados:',
    datos
  );

  // ==========================================
  // REGISTRO
  // ==========================================
  console.log(
  JSON.stringify(
    datos,
    null,
    2
  )
  );

  this.authService
    .registrar(datos)
    .subscribe({

      next: () => {

        this.limpiarFormulario();

        Swal.fire({

          icon: 'success',

          title:
            'Registro exitoso',

          text:
            'El profesor fue registrado correctamente.',

          position:
            'top-end',

          toast: true,

          showConfirmButton: false,

          timer: 2500

        });

      },

      error: (error) => {

        console.error(error);
        console.log(
          error.error.detail
        );

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text:

            error.error?.detail ||

            'No fue posible registrar el profesor'

        });

      }

    });

  }

private limpiarFormulario(): void {

  this.nombreProfesor = '';

  this.institucionEducativa = '';

  this.correo = '';

  this.password = '';

  this.nivelSeleccionado = 0;

  this.idTipoInstitucion = null;

  this.idCarrera = null;

  this.idProvincia = null;

  this.idCiudad = null;

  this.ciudades = [];

  this.mostrarInstitucion = false;

  this.mostrarCarrera = false;

  this.mostrarPassword = false;

}
}


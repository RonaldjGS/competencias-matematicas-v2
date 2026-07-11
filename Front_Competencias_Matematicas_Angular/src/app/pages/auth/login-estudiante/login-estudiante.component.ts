import { 
  Component, 
  ChangeDetectorRef 

} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthEstudianteService
} from '../../../services/auth-estudiante.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-estudiante',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './login-estudiante.component.html',

  styleUrl:
    './login-estudiante.component.css'
})
export class LoginEstudianteComponent {

  correo = '';

  password = '';

  mostrarPassword = false;

  // =====================================
  // RECUPERAR CONTRASEÑA
  // =====================================

  mostrarModalRecuperar = false;

  correoRecuperacion = '';

  correoVerificado = false;

  nombreEstudiante = '';

  nuevaPassword = '';

  confirmarPassword = '';

  mostrarNuevaPassword = false;

  mostrarConfirmarPassword = false;

  constructor(

    private authService:
    AuthEstudianteService,

    private cdr:ChangeDetectorRef,

    private router:
    Router

  ) {}

  irLoginEstudiante(): void {

    this.router.navigate([
      '/login-estudiante'
    ]);

  }

  irLoginProfesor(): void {

    this.router.navigate([
      '/login-profesor'
    ]);

  }

  togglePassword(): void {

    this.mostrarPassword =
      !this.mostrarPassword;

  }

  irRegistroEstudiante(): void {

    this.router.navigate([
      '/registro-estudiante'
    ]);

  }

  loginEstudiante(): void {

    if (

      !this.correo ||

      !this.password

    ) {

      alert(
        'Debe ingresar correo y contraseña'
      );

      return;

    }

    const datos = {

      correo_estudiante:
        this.correo,

      password:
        this.password

    };

    this.authService
      .login(datos)
      .subscribe({

        next: (response: any) => {

          localStorage.setItem(

            'token_estudiante',

            response.access_token

          );

          localStorage.setItem(

            'nombre_estudiante',

            response.usuario.nombre_estudiante

          );

          localStorage.setItem(

            'id_nivel',

            response.usuario.id_nivel.toString()

          );

          localStorage.setItem(

            'id_estudiante',

            response.usuario.id_estudiante
              .toString()

          );

          localStorage.setItem(

            'nombre_nivel',

            response.usuario.nombre_nivel

          );

          this.router.navigate([

            '/dashboard-estudiante'

          ]);

          this.refrescarVista();

        },

        error: (error) => {

          console.error(error);

          alert(
            'Correo o contraseña incorrectos'
          );

        }

      });

  }

  irLoginAdmin(): void {

      this.router.navigate([

          '/login-admin'

      ]);

  }

  // =====================================
  // ABRIR MODAL
  // =====================================

  abrirRecuperacion(): void {

    this.mostrarModalRecuperar = true;

  }

  // =====================================
  // CERRAR MODAL
  // =====================================

  cerrarRecuperacion(): void {

    this.mostrarModalRecuperar = false;

    this.correoRecuperacion = '';

    this.correoVerificado = false;

    this.nombreEstudiante = '';

    this.nuevaPassword = '';

    this.confirmarPassword = '';

    this.mostrarNuevaPassword = false;

    this.mostrarConfirmarPassword = false;

  }

  // =====================================
  // VERIFICAR CORREO
  // =====================================

  verificarCorreo(): void {

      if (

          !this.correoRecuperacion

      ){

          alert(

              'Ingrese un correo.'

          );

          return;

      }

      this.authService

          .verificarCorreo(

              this.correoRecuperacion

          )

          .subscribe({

              next:(respuesta:any)=>{

                  if(

                      !respuesta.existe

                  ){

                      alert(

                          'El correo no existe.'

                      );

                      return;

                  }

                  this.correoVerificado = true;

                  this.nombreEstudiante =

                      respuesta.nombre_estudiante;

                  this.refrescarVista();

              },

              error:(error)=>{

                  console.error(

                      error

                  );

              }

          });

  }

  private refrescarVista():void{

    this.cdr.detectChanges();

  }

  // =====================================
  // GUARDAR NUEVA CONTRASEÑA
  // =====================================

  guardarNuevaPassword(): void {

    // ==============================
    // VALIDACIONES
    // ==============================

    if (

      !this.nuevaPassword ||

      !this.confirmarPassword

    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Campos incompletos',

        text: 'Debe completar todos los campos.'

      });

      return;

    }

    if (

      this.nuevaPassword.length < 8

    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Contraseña inválida',

        text: 'La contraseña debe tener al menos 8 caracteres.'

      });

      return;

    }

    if (

      this.nuevaPassword !==

      this.confirmarPassword

    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Contraseñas diferentes',

        text: 'Las contraseñas no coinciden.'

      });

      return;

    }

    // Guardar el estado
  this.mostrarModalRecuperar = false;

  setTimeout(() => {

    Swal.fire({

      title: '¿Cambiar contraseña?',

      text: 'Se actualizará la contraseña del estudiante.',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Aceptar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#7c3aed'

    }).then((resultado) => {

      if (!resultado.isConfirmed) {

        // Si cancela, volver a abrir el modal
        this.mostrarModalRecuperar = true;
        return;

      }

      this.authService
        .resetPassword(
          this.correoRecuperacion,
          this.nuevaPassword
        )
        .subscribe({

          next: () => {

            Swal.fire({

              icon: 'success',

              title: 'Contraseña actualizada',

              text: 'Ahora puede iniciar sesión con la nueva contraseña.',

              confirmButtonColor: '#7c3aed'

            });

            this.cerrarRecuperacion();

          },

          error: (error) => {

            this.mostrarModalRecuperar = true;

            Swal.fire({

              icon: 'error',

              title: 'Error',

              text: error.error?.detail ||

                    'No fue posible actualizar la contraseña.'

            });

          }

        });

    });

  }, 100);
  }

}
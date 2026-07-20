import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
Router
} from '@angular/router';

import {
  AuthProfesorService
} from '../../../services/auth-profesor.service';

import { FormsModule } from '@angular/forms';

import {

ChangeDetectorRef

} from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-profesor',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule
  ],
  templateUrl:
  './login-profesor.component.html',

  styleUrl:
  './login-profesor.component.css'
})
export class LoginProfesorComponent {

    correo = '';

    password = '';

    mostrarPassword = false;

    // =====================================
    // RECUPERAR CONTRASEÑA
    // =====================================

    mostrarModalRecuperar = false;

    correoRecuperacion = '';

    correoVerificado = false;

    nombreProfesor = '';

    nuevaPassword = '';

    confirmarPassword = '';

    mostrarNuevaPassword = false;

    mostrarConfirmarPassword = false;

  constructor(
    private authService:
      AuthProfesorService,

      private cdr:
      ChangeDetectorRef,
    
      private router: Router
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



  irRegistroProfesor(): void {

    this.router.navigate([
      '/registro-profesor'
    ]);


  }


  loginProfesor(): void {

    if (

      !this.correo ||

      !this.password

    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Campos incompletos',

        text: 'Debe ingresar correo y contraseña.',

        confirmButtonColor: '#7c3aed'

      });

      return;

    }

    const datos = {

      correo:
        this.correo,

      password:
        this.password

    };

    this.authService
      .login(datos)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Login correcto',
            response
          );

          localStorage.setItem(

            'token_profesor',

            response.access_token

          );

          localStorage.setItem(

            'id_profesor',

            response.usuario.id_profesor.toString()

          );

          localStorage.setItem(

            'id_nivel',

            response.usuario.id_nivel.toString()

          );

          localStorage.setItem(

            'nombre_profesor',

            response.usuario.nombre_profesor

          );

          this.router.navigate([

            '/dashboard-profesor'

          ]);

        },

        error: (error) => {

          console.error(error);

          Swal.fire({

            icon: 'error',

            title: 'Acceso denegado',

            text: 'Correo o contraseña incorrectos.',

            confirmButtonColor: '#7c3aed'

          });

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

      this.nombreProfesor = '';

      this.nuevaPassword = '';

      this.confirmarPassword = '';

      this.mostrarNuevaPassword = false;

      this.mostrarConfirmarPassword = false;

  }

  // =====================================
  // REFRESCAR VISTA
  // =====================================

  private refrescarVista(): void {

      this.cdr.detectChanges();

  }

  // =====================================
  // VERIFICAR CORREO
  // =====================================

  verificarCorreo(): void {

      if (

        !this.correoRecuperacion

      ){

        this.mostrarModalRecuperar = false;

        this.refrescarVista();

        setTimeout(() => {

            Swal.fire({

                icon: 'warning',

                title: 'Correo requerido',

                text: 'Ingrese un correo electrónico.',

                confirmButtonColor: '#7c3aed'

            }).then(() => {

                this.mostrarModalRecuperar = true;

                this.refrescarVista();

            });

        }, 100);

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

                    this.mostrarModalRecuperar = false;

                    this.refrescarVista();

                    setTimeout(() => {

                        Swal.fire({

                            icon: 'error',

                            title: 'Correo no encontrado',

                            text: 'El correo ingresado no se encuentra registrado.',

                            confirmButtonColor: '#7c3aed'

                        }).then(() => {

                            this.mostrarModalRecuperar = true;

                            this.refrescarVista();

                        });

                    }, 100);

                    return;

                  }

                  this.correoVerificado = true;

                  this.nombreProfesor =

                      respuesta.nombre_profesor;

                  this.refrescarVista();

              },

              error:(error)=>{

                  console.error(

                      error

                  );

              }

          });

  }

  // =====================================
  // GUARDAR NUEVA CONTRASEÑA
  // =====================================

  guardarNuevaPassword(): void {

      if (

          !this.nuevaPassword ||

          !this.confirmarPassword

      ) {

          Swal.fire({

              icon:'warning',

              title:'Campos incompletos',

              text:'Debe completar todos los campos.'

          });

          return;

      }

      if (

          this.nuevaPassword.length < 8

      ){

          Swal.fire({

              icon:'warning',

              title:'Contraseña inválida',

              text:'Debe tener mínimo 8 caracteres.'

          });

          return;

      }

      if (

          this.nuevaPassword !==

          this.confirmarPassword

      ){

          Swal.fire({

              icon:'warning',

              title:'Contraseñas diferentes',

              text:'Las contraseñas no coinciden.'

          });

          return;

      }

      // Cerrar el modal personalizado
      this.mostrarModalRecuperar = false;

      // Esperar un instante para que Angular quite el modal
      setTimeout(() => {

        Swal.fire({

          title: '¿Cambiar contraseña?',

          text: 'Se actualizará la contraseña del profesor.',

          icon: 'question',

          showCancelButton: true,

          confirmButtonText: 'Aceptar',

          cancelButtonText: 'Cancelar',

          confirmButtonColor: '#7c3aed'

        }).then((resultado) => {

          if (!resultado.isConfirmed) {

            // Si cancela, volver a mostrar el modal
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

                console.error(error);

                this.mostrarModalRecuperar = true;

                Swal.fire({

                  icon: 'error',

                  title: 'Error',

                  text:

                    error.error?.detail ||

                    'No fue posible actualizar la contraseña.'

                });

              }

            });

        });

      }, 150);
  }    

}

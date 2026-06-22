import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
Router
} from '@angular/router';

import {
  AuthProfesorService
} from '../../../services/auth-profesor.service';

import { FormsModule } from '@angular/forms';

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

constructor(
  private authService:
    AuthProfesorService,
  
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

    alert(
      'Debe ingresar correo y contraseña'
    );

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

          'nombre_profesor',

          response.usuario.nombre_profesor

        );

        this.router.navigate([

          '/dashboard-profesor'

        ]);

      },

      error: (error) => {

        console.error(error);

        alert(
          'Correo o contraseña incorrectos'
        );

      }

    });

}


}

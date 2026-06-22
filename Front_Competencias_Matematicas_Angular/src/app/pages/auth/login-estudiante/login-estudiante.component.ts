import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthEstudianteService
} from '../../../services/auth-estudiante.service';

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

  constructor(

    private authService:
    AuthEstudianteService,

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

          this.router.navigate([

            '/dashboard-estudiante'

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
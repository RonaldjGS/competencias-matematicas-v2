import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthProfesorService {

  private apiUrl =
    `${environment.apiUrl}/auth/profesores`;

  constructor(
    private http: HttpClient
  ) {}

  registrar(
    datos: any
  ) {

    return this.http.post(

      `${this.apiUrl}/register`,

      datos

    );

  }

  login(datos: any) {

    return this.http.post(
      `${this.apiUrl}/login`,
      datos
    );

  }

  // ==========================================
  // VERIFICAR CORREO
  // ==========================================

  verificarCorreo(

    correo: string

  ){

    return this.http.post(

      `${this.apiUrl}/verify-email`,

      {

        correo

      }

    );

  }

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  resetPassword(

    correo:string,

    nuevaPassword:string

  ){

    return this.http.put(

      `${this.apiUrl}/reset-password`,

      {

        correo,

        new_password:nuevaPassword

      }

    );

  }

}
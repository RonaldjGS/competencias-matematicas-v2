import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthEstudianteService {

  private apiUrl =
    `${environment.apiUrl}/auth/estudiantes`;

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

 // =====================================
// VERIFICAR CORREO
// =====================================

verificarCorreo(

    correo_estudiante: string

){

    return this.http.post(

        `${this.apiUrl}/verificar-correo`,

        {

            correo_estudiante

        }

    );

}

// =====================================
// CAMBIAR CONTRASEÑA
// =====================================

resetPassword(

    correo_estudiante: string,

    new_password: string

){

    return this.http.put(

        `${this.apiUrl}/reset-password`,

        {

            correo_estudiante,

            new_password

        }

    );

}

}
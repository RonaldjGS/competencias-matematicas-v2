import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthProfesorService {

  private apiUrl =
    'http://localhost:8000/auth/profesores';

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

}
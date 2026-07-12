import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmoduloService {

  private apiUrl =
    `${environment.apiUrl}/quiz`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerSubmodulosDisponibles(
    idEstudiante: number,
    idCompetencia: number
  ) {

    return this.http.get<any[]>(

      `${this.apiUrl}/submodulos-disponibles` +

      `?id_estudiante=${idEstudiante}` +

      `&id_competencia=${idCompetencia}`

    );

  }

}
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {

  private apiUrl =
    'http://localhost:8000/catalogos';

  constructor(
    private http: HttpClient
  ) {}

  obtenerCompetencias() {

    return this.http.get<any[]>(

      `${this.apiUrl}/competencias`

    );

  }

}
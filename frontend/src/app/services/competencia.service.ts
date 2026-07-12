import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {

  private apiUrl =
    `${environment.apiUrl}/catalogos`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerCompetencias() {

    return this.http.get<any[]>(

      `${this.apiUrl}/competencias`

    );

  }

}
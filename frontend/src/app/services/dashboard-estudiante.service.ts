import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({

  providedIn: 'root'

})

export class DashboardEstudianteService {

  private api =
    `${environment.apiUrl}/dashboard-estudiante`;

  constructor(

    private http: HttpClient

  ) {}

  obtenerResumen(

    idEstudiante: number

  ): Observable<any> {

    return this.http.get<any>(

      `${this.api}/resumen/${idEstudiante}`

    );

  }

  obtenerRanking(

    idEstudiante: number

  ):Observable<any>{

      return this.http.get(

          `${this.api}/ranking/${idEstudiante}`

      );

  }

  obtenerActividadReciente(
    idEstudiante: number
  ){

        return this.http.get<any>(

            `${this.api}/actividad/${idEstudiante}`

        );

  }

}
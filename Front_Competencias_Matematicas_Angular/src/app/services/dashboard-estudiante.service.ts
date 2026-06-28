import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class DashboardEstudianteService {

  private api =
    'http://127.0.0.1:8000/dashboard-estudiante';

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
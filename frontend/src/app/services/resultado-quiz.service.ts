import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({

  providedIn: 'root'

})

export class ResultadoQuizService {

  private apiUrl =
    `${environment.apiUrl}`;

  constructor(

    private http: HttpClient

  ) {}

  // =====================================
  // OBTENER RESULTADO
  // =====================================

  obtenerResultado(

    idResultado: number

  ): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/quiz/resultado/${idResultado}`

    );  

  }

  

  //private historialUrl =
  //'http://localhost:8000/estudiantes-profesor';

  //obtenerDetalleIntento(

  //  idResultado:number

  //){

  //  return this.http.get<any[]>(

  //    `${this.historialUrl}/historial/detalle/${idResultado}`

  //  );

  //}

}
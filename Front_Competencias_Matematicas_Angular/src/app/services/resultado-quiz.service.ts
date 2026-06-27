import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class ResultadoQuizService {

  private apiUrl = 'http://127.0.0.1:8000';

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

}
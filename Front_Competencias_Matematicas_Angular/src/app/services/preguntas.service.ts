import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  private apiUrl =
    'http://localhost:8000/preguntas';

  constructor(
    private http: HttpClient
  ) {}

  importarExcel(

  formData: FormData,

  idCompetencia: number,

  idSubmodulo: number,

  idTema: number

) {

  const token =
    localStorage.getItem(
      'token_profesor'
    );

  const headers =
    new HttpHeaders({

      Authorization:
        `Bearer ${token}`

    });

  return this.http.post(

`${this.apiUrl}/importar-excel?id_competencia=${idCompetencia}&id_submodulo=${idSubmodulo}&id_tema=${idTema}`,

    formData,

    { headers }

  );

}

}
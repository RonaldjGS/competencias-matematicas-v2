import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  private apiUrl =
    `${environment.apiUrl}/preguntas`;

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

  //==========================================
  // DESCARGAR PLANTILLA
  //==========================================

  descargarPlantilla(){

      const token =

          localStorage.getItem(

              'token_profesor'

          );

      const headers =

          new HttpHeaders({

              Authorization:

                  `Bearer ${token}`

          });

      return this.http.get(

          `${this.apiUrl}/descargar-plantilla`,

          {

              headers,

              responseType:'blob'

          }

      );

  }

  //==========================================
  // MIS PREGUNTAS
  //==========================================

  obtenerMisPreguntas(){

      const token =

          localStorage.getItem(

              'token_profesor'

          );

      const headers =

          new HttpHeaders({

              Authorization:

              `Bearer ${token}`

          });

      return this.http.get(

          `${this.apiUrl}/mis-preguntas`,

          {

              headers

          }

      );

  }

  //==========================================
  // DETALLE DE PREGUNTA
  //==========================================

  obtenerPregunta(

      idPregunta:number

  ){

      const token =

          localStorage.getItem(

              'token_profesor'

          );

      const headers =

          new HttpHeaders({

              Authorization:

                  `Bearer ${token}`

          });

      return this.http.get(

          `${this.apiUrl}/${idPregunta}`,

          {

              headers

          }

      );

  }

  //==========================================
  // ACTUALIZAR PREGUNTA
  //==========================================

  actualizarPregunta(

      idPregunta:number,

      datos:any

  ){

      const token =

          localStorage.getItem(

              'token_profesor'

          );

      const headers =

          new HttpHeaders({

              Authorization:

                  `Bearer ${token}`

          });

      return this.http.put(

          `${this.apiUrl}/${idPregunta}`,

          datos,

          {

              headers

          }

      );

  }

  //==========================================
  // BUSCAR PREGUNTAS
  //==========================================

  buscarPreguntas(

      idCompetencia?:number,

      idSubmodulo?:number,

      idTema?:number

  ){

      const token =

          localStorage.getItem(

              'token_profesor'

          );

      const headers =

          new HttpHeaders({

              Authorization:

                  `Bearer ${token}`

          });

      let params =

          new HttpParams();

      if(idCompetencia){

          params = params.set(

              'id_competencia',

              idCompetencia

          );

      }

      if(idSubmodulo){

          params = params.set(

              'id_submodulo',

              idSubmodulo

          );

      }

      if(idTema){

          params = params.set(

              'id_tema',

              idTema

          );

      }

      return this.http.get(

          `${this.apiUrl}/buscar`,

          {

              headers,

              params

          }

      );

  }

  //==========================================
  // CAMBIAR ESTADO
  //==========================================

  cambiarEstadoPregunta(

      idPregunta:number

  ){

      const token =

          localStorage.getItem(

              'token_profesor'

          );

      const headers =

          new HttpHeaders({

              Authorization:

                  `Bearer ${token}`

          });

      return this.http.patch(

          `${this.apiUrl}/${idPregunta}/estado`,

          {},

          {

              headers

          }

      );

  }

}
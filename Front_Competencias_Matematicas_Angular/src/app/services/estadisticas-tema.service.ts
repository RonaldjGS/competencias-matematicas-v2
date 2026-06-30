import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EstadisticasTemaService {

  private apiUrl =
    'http://localhost:8000/quiz';

  constructor(

    private http: HttpClient

  ) {}

  obtenerEstadisticas(

      idEstudiante:number,

      idCompetencia:number,

      idSubmodulo:number,

      idTema:number

  ){

      return this.http.get<any>(

          `${this.apiUrl}/estadisticas-tema` +

          `?id_estudiante=${idEstudiante}` +

          `&id_competencia=${idCompetencia}` +

          `&id_submodulo=${idSubmodulo}` +

          `&id_tema=${idTema}`

      );

  }

}
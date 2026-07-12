import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EstadisticasTemaService {

  private apiUrl =
    `${environment.apiUrl}/quiz`;

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
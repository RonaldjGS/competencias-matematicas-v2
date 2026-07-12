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
export class TemaService {

  private apiUrl =
    `${environment.apiUrl}/quiz`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerTemas(

    idNivel: number,
    idEstudiante: number,
    idCompetencia: number,
    idSubmodulo: number

  ) {

    return this.http.get<any[]>(

        `${this.apiUrl}/temas-disponibles` +

        `?id_nivel=${idNivel}` +

        `&id_estudiante=${idEstudiante}` +

        `&id_competencia=${idCompetencia}` +

        `&id_submodulo=${idSubmodulo}`

    );

  }

}
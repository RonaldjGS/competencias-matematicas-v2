import {

  Injectable

} from '@angular/core';

import {

  HttpClient,

  HttpParams

} from '@angular/common/http';

import {

  Observable

} from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({

  providedIn: 'root'

})

export class VideoEstudianteService {

  private apiUrl =
    `${environment.apiUrl}`;

  constructor(

    private http: HttpClient

  ) { }

  // =====================================
  // VIDEO INTRODUCTORIO
  // =====================================

  getVideoIntro(

    idCompetencia: number,

    idSubmodulo: number,

    idTema: number

  ): Observable<any> {

    const params = new HttpParams()

      .set(

        'id_competencia',

        idCompetencia.toString()

      )

      .set(

        'id_submodulo',

        idSubmodulo.toString()

      )

      .set(

        'id_tema',

        idTema.toString()

      );

    return this.http.get<any>(

      `${this.apiUrl}/videos/intro`,

      {

        params

      }

    );

  }

    // =====================================
    // REGISTRAR VIDEO VISTO
    // =====================================

    registrarVideoVisualizado(

        idEstudiante: number,

        idVideo: number

    ): Observable<any> {

        return this.http.post(

            `${this.apiUrl}/videos/visualizado`,

            {

                id_estudiante: idEstudiante,

                id_video: idVideo

            }

        );

    }

    // =====================================
    // REGISTRAR VIDEO OMITIDO
    // =====================================

    registrarVideoOmitido(

        idEstudiante: number,

        idVideo: number

    ): Observable<any> {

        return this.http.post(

            `${this.apiUrl}/videos/omitido`,

            {

                id_estudiante: idEstudiante,

                id_video: idVideo

            }

        );

    }

    

}
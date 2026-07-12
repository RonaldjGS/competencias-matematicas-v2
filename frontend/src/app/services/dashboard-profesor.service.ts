import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({

  providedIn:'root'

})

export class DashboardProfesorService{

    private api =
    `${environment.apiUrl}/dashboard-profesor`;

    constructor(

        private http:HttpClient

    ){}

    obtenerResumen(

        idProfesor:number

    ){

        return this.http.get<any>(

            `${this.api}/resumen/${idProfesor}`

        );

    }

    obtenerCompetencias(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.api}/competencias/${idProfesor}`

        );

    }

    obtenerPreguntasError(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.api}/preguntas-error/${idProfesor}`

        );

    }

    
    obtenerPrecisionDificultad(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.api}/precision-dificultad/${idProfesor}`

        );

    }


    obtenerSubmodulos(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.api}/rendimiento-submodulos/${idProfesor}`

        );

    }

    obtenerTemas(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.api}/rendimiento-temas/${idProfesor}`

        );

    }

    obtenerActividadReciente(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.api}/actividad-reciente/${idProfesor}`

        );

    }

}
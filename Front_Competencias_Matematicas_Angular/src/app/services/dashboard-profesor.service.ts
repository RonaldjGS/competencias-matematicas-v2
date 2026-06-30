import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

@Injectable({

  providedIn:'root'

})

export class DashboardProfesorService{

    private apiUrl =

    'http://localhost:8000/dashboard-profesor';

    constructor(

        private http:HttpClient

    ){}

    obtenerResumen(

        idProfesor:number

    ){

        return this.http.get<any>(

            `${this.apiUrl}/resumen/${idProfesor}`

        );

    }

    obtenerCompetencias(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.apiUrl}/competencias/${idProfesor}`

        );

    }

    obtenerPreguntasError(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.apiUrl}/preguntas-error/${idProfesor}`

        );

    }

    

}
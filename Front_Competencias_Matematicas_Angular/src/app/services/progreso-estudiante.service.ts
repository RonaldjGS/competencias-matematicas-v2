import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import Chart from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})

export class ProgresoEstudianteService {

  private apiUrl =
    'http://localhost:8000/progreso';

    graficoTemas!: Chart;

    datosTemas:any[]=[];
  
    constructor(

    private http: HttpClient

  ) {}

  obtenerResumen(

    idEstudiante:number

  ){

      return this.http.get<any>(

          `${this.apiUrl}/resumen/${idEstudiante}`

      );

  }

  obtenerTemas(

    idEstudiante:number

    ){

        return this.http.get<any[]>(

            `${this.apiUrl}/temas/${idEstudiante}`

        );

    }
    
    obtenerEvolucion(

    idEstudiante:number,
    dias:string

    ){

        return this.http.get<any[]>(

            `${this.apiUrl}/evolucion/${idEstudiante}?dias=${dias}`

        );

    }


    obtenerCompetencias(

        idEstudiante:number

    ){

        return this.http.get<any[]>(

            `${this.apiUrl}/rendimiento-competencias/${idEstudiante}`

        );

    }

    obtenerSubmodulos(

        idEstudiante:number

    ){

        return this.http.get<any[]>(

            `${this.apiUrl}/rendimiento-submodulos/${idEstudiante}`

        );

    }

    obtenerDificultades(

        idEstudiante:number,

        idCompetencia?:number,

        idSubmodulo?:number,

        idTema?:number

    ){
        let params = new HttpParams();

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

        return this.http.get<any[]>(

            `${this.apiUrl}/rendimiento-dificultad/${idEstudiante}`,
                { params }

        );

    }

    obtenerHistorial(

        idEstudiante:number

    ){

        return this.http.get<any[]>(
            
            `${this.apiUrl}/historial/${idEstudiante}`

        );

    }

}
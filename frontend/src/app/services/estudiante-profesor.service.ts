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

export class EstudianteProfesorService{

  private apiUrl =
    `${environment.apiUrl}/estudiantes-profesor`;

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

    obtenerEstudiantes(

        idProfesor:number

    ){

        return this.http.get<any[]>(

            `${this.apiUrl}/lista/${idProfesor}`

        );

    }


    crearEstudiante(

      idProfesor:number,

      datos:any

    ){

      return this.http.post(

          `${this.apiUrl}/crear/${idProfesor}`,

          datos

      );

    }

    obtenerPerfilEstudiante(

      idEstudiante:number

    ){

        return this.http.get(

            `${this.apiUrl}/perfil/${idEstudiante}`

        );

    }

    obtenerRendimientoCompetencias(

      idEstudiante:number

    ){

      return this.http.get(

          `${this.apiUrl}/competencias/${idEstudiante}`

      );

    }

    obtenerRendimientoSubmodulos(

      idEstudiante:number,

      idCompetencia:number

    ){

      return this.http.get(

        `${this.apiUrl}/submodulos/${idEstudiante}/${idCompetencia}`

      );

    }


    obtenerRendimientoTemas(

      idEstudiante:number,

      idCompetencia:number,

      idSubmodulo:number

    ){

      return this.http.get(

        `${this.apiUrl}/perfil/${idEstudiante}/temas/${idCompetencia}/${idSubmodulo}`

      );

    }

    obtenerSubmodulosFiltro(

      idEstudiante:number,

      idCompetencia:number

    ){

      return this.http.get(

          `${this.apiUrl}/submodulos-filtro/${idEstudiante}/${idCompetencia}`

      );

    }

    obtenerComparacionCurso(
      idEstudiante: number
    ){

      return this.http.get(

        `${this.apiUrl}/comparacion-curso/${idEstudiante}`

      );

    }

    obtenerEvolucionRendimiento(
      idEstudiante:number
    ){

      return this.http.get(

        `${environment.apiUrl}/catalogos/profesor/estudiante/${idEstudiante}/evolucion`

      );

    }

    obtenerPrecisionDificultad(

      idEstudiante:number

    ){

      return this.http.get(

          `${this.apiUrl}/perfil/${idEstudiante}/precision-dificultad`

      );

    } 


    obtenerHistorialEvaluaciones(

      idEstudiante:number

    ){

      return this.http.get<any[]>(

          `${this.apiUrl}/historial/${idEstudiante}`

      );

    }

    obtenerDetalleHistorial(

      idResultado:number

    ){

      return this.http.get<any[]>(

          `${this.apiUrl}/historial/detalle/${idResultado}`

      );

    }

}
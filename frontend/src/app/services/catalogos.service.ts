import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private apiUrl =
    `${environment.apiUrl}/catalogos`;

  constructor(
    private http: HttpClient
  ) {}

  private obtenerHeaders(){

    const token = localStorage.getItem(
        'token_profesor'
    );

    return {

        headers:new HttpHeaders({

            Authorization:`Bearer ${token}`

        })

    };

}

  obtenerNiveles() {

    return this.http.get(
      `${this.apiUrl}/niveles`
    );

  }

  obtenerCarreras() {

    return this.http.get(
      `${this.apiUrl}/carreras`
    );

  }

  obtenerTiposInstitucion() {

    return this.http.get(
      `${this.apiUrl}/tipos-institucion`
    );

  }

  obtenerCiudades() {

    return this.http.get(
      `${this.apiUrl}/ciudades`
    );

  }

  obtenerProvincias() {

    return this.http.get(
        `${this.apiUrl}/provincias`
    );

    }

obtenerCiudadesPorProvincia(
  idProvincia: number
) {

  return this.http.get(

    `${this.apiUrl}/ciudades/provincia/${idProvincia}`

  );

}

obtenerCompetencias() {

  return this.http.get(
    `${this.apiUrl}/competencias`
  );

}

obtenerSubmodulos() {

  return this.http.get(
    `${this.apiUrl}/submodulos`
  );

}

obtenerTemas(
  
) {

  return this.http.get(
    `${this.apiUrl}/temas`
  );

}

obtenerTiposContenido(){

    return this.http.get(

        `${this.apiUrl}/tipos-contenido`

    );

}

obtenerTemasPorNivel(
  idNivel: number
) {

  return this.http.get(

    `${this.apiUrl}/temas/${idNivel}`

  );

}

obtenerSubmodulosPorCompetencia(

  idCompetencia:number

){

  return this.http.get(

    `${this.apiUrl}/submodulos/competencia/${idCompetencia}`

  );

}

obtenerTemasProfesor(){

    return this.http.get(

        `${this.apiUrl}/temas-profesor`,

        this.obtenerHeaders()

    );

}

// =====================================
// PERIODOS POR NIVEL
// =====================================

obtenerPeriodosPorNivel(
  idNivel: number
) {

  return this.http.get<any[]>(

    `${this.apiUrl}/periodos/${idNivel}`

  );

}

obtenerProfesoresPorNivel(
    idNivel:number
){

    return this.http.get<any[]>(

        `${this.apiUrl}/profesores/${idNivel}`

    );

}

obtenerTemasEstudiante(){

    const token =

        localStorage.getItem('token_estudiante');

    return this.http.get(

        `${this.apiUrl}/temas-estudiante`,

        {

            headers:{

                Authorization:`Bearer ${token}`

            }

        }

    );

}

}
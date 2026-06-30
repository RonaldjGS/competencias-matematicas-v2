import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private apiUrl =
    'http://localhost:8000/catalogos';

  constructor(
    private http: HttpClient
  ) {}

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

obtenerTemasPorNivel(
  idNivel: number
) {

  return this.http.get(

    `${this.apiUrl}/temas/${idNivel}`

  );

}

}
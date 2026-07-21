import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({

  providedIn: 'root'

})

export class VideoProfesorService {

  private apiUrl =
    `${environment.apiUrl}/videos`;

  constructor(

    private http: HttpClient

  ) { }

  getResumen(): Observable<any> {

    const idNivel = localStorage.getItem(

        'id_nivel'

    );

    return this.http.get<any>(

        `${this.apiUrl}/resumen?id_nivel=${idNivel}`

    );

  }

  getVideos(): Observable<any[]> {

    const idNivel = localStorage.getItem(

        'id_nivel'

    );

    return this.http.get<any[]>(

        `${this.apiUrl}/lista?id_nivel=${idNivel}`

    );

  }

  getVideo(

    idVideo: number

  ): Observable<any> {

    return this.http.get<any>(

      `${this.apiUrl}/${idVideo}`

    );

  }

  crearVideo(

    datos: any

  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/crear`,

      datos

    );

  }

  editarVideo(

    idVideo: number,

    datos: any

  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/editar/${idVideo}`,

      datos

    );

  }

  cambiarEstado(

    idVideo: number

  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}/estado/${idVideo}`,

      {}

    );

  }

  eliminarVideo(

    idVideo: number

  ): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/eliminar/${idVideo}`

    );

  }


  actualizarVideo(

      idVideo:number,

      datos:any

  ){

      return this.http.put(

          `${this.apiUrl}/actualizar/${idVideo}`,

          datos

      );

  }

  actualizarEstado(

    idVideo:number

  ){

      return this.http.patch(

          `${this.apiUrl}/estado/${idVideo}`,

          {}

      );

  }

}
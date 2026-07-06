import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class VideoProfesorService {

  private apiUrl = 'http://localhost:8000/videos';

  constructor(

    private http: HttpClient

  ) { }

  getResumen(): Observable<any> {

    return this.http.get<any>(

      `${this.apiUrl}/resumen`

    );

  }

  getVideos(): Observable<any[]> {

    return this.http.get<any[]>(

      `${this.apiUrl}/lista`

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
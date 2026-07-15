import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({

    providedIn:'root'

})

export class VideoAdminService{

    private apiUrl =

        `${environment.apiUrl}/admin/videos`;

    constructor(

        private http:HttpClient

    ){}

    //======================================
    // RESUMEN
    //======================================

    getResumen():Observable<any>{

        return this.http.get(

            `${this.apiUrl}/resumen`

        );

    }

    //======================================
    // LISTA
    //======================================

    getVideos():Observable<any[]>{

        return this.http.get<any[]>(

            `${this.apiUrl}/lista`

        );

    }

    //======================================
    // DETALLE
    //======================================

    getVideo(

        idVideo:number

    ):Observable<any>{

        return this.http.get(

            `${this.apiUrl}/${idVideo}`

        );

    }

    //======================================
    // ACTUALIZAR
    //======================================

    actualizarVideo(

        idVideo:number,

        datos:any

    ){

        return this.http.put(

            `${this.apiUrl}/actualizar/${idVideo}`,

            datos

        );

    }

    //======================================
    // CAMBIAR ESTADO
    //======================================

    actualizarEstado(

        idVideo:number

    ){

        return this.http.patch(

            `${this.apiUrl}/estado/${idVideo}`,

            {}

        );

    }

    //======================================
    // ELIMINAR
    //======================================

    eliminarVideo(

        idVideo:number

    ){

        return this.http.delete(

            `${this.apiUrl}/eliminar/${idVideo}`

        );

    }

}
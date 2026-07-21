import { Injectable } from '@angular/core';

import {

    HttpClient,

    HttpHeaders,

    HttpParams

} from '@angular/common/http';

import {

    Observable

} from 'rxjs';

import {

    environment

} from '../../environments/environment';

@Injectable({

    providedIn:'root'

})

export class ContenidoAcademicoService{

    private apiUrl =

    `${environment.apiUrl}/contenido-academico`;

    constructor(

        private http:HttpClient

    ){}

    //==========================================
    // HEADERS
    //==========================================

    private obtenerHeaders(){

        const token =

            localStorage.getItem('token_profesor')

            ||

            localStorage.getItem('token_estudiante');

        return{

            headers:new HttpHeaders({

                Authorization:

                `Bearer ${token}`

            })

        };

    }

    //==========================================
    // LISTA CONTENIDOS
    //==========================================

    obtenerContenidos():Observable<any[]>{

        const idNivel =

            localStorage.getItem(

                'id_nivel'

            );

        return this.http.get<any[]>(

            `${this.apiUrl}/lista?id_nivel=${idNivel}`,

            this.obtenerHeaders()

        );

    }

    //==========================================
    // DETALLE CONTENIDO
    //==========================================

    obtenerContenido(

        idContenido:number

    ):Observable<any>{

        return this.http.get<any>(

            `${this.apiUrl}/${idContenido}`,

            this.obtenerHeaders()

        );

    }

    //==========================================
    // CREAR CONTENIDO
    //==========================================

    crearContenido(formData: FormData){

        return this.http.post(

            `${this.apiUrl}/crear`,

            formData,

            this.obtenerHeaders()

        );

    }

    //==========================================
    // ACTUALIZAR CONTENIDO
    //==========================================

    actualizarContenido(

        idContenido:number,

        datos:any

    ):Observable<any>{

        return this.http.put(

            `${this.apiUrl}/actualizar/${idContenido}`,

            datos,

            this.obtenerHeaders()

        );

    }

    //==========================================
    // CAMBIAR ESTADO
    //==========================================

    cambiarEstado(

        idContenido:number

    ):Observable<any>{

        return this.http.patch(

            `${this.apiUrl}/estado/${idContenido}`,

            {},

            this.obtenerHeaders()

        );

    }

    //==========================================
    // ELIMINAR CONTENIDO
    //==========================================

    eliminarContenido(

        idContenido:number

    ):Observable<any>{

        return this.http.delete(

            `${this.apiUrl}/eliminar/${idContenido}`,

            this.obtenerHeaders()

        );

    }

    //==========================================
    // CONTENIDOS ESTUDIANTE
    //==========================================

    obtenerContenidosEstudiante():Observable<any[]>{

        return this.http.get<any[]>(

            `${this.apiUrl}/estudiante`,

            this.obtenerHeaders()

        );

    }

    obtenerResumen(){

        const idNivel =

            localStorage.getItem(

                'id_nivel'

            );

        return this.http.get(

            `${this.apiUrl}/resumen?id_nivel=${idNivel}`,

            this.obtenerHeaders()

        );

    }

}
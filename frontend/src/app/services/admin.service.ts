import {

  Injectable

} from '@angular/core';

import {

  HttpClient

} from '@angular/common/http';

import {

  Observable

} from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({

  providedIn: 'root'

})

export class AdminService {

    private apiUrl =

        `${environment.apiUrl}/admin`;

    constructor(

        private http: HttpClient

    ) {}

    // =====================================
    // RESUMEN DASHBOARD
    // =====================================

    obtenerResumen(): Observable<any> {

        return this.http.get(

            `${this.apiUrl}/dashboard/resumen`

        );

    }

    // =====================================
    // LISTA DE USUARIOS
    // =====================================

    obtenerUsuarios(): Observable<any> {

        return this.http.get(

            `${this.apiUrl}/usuarios`

        );

    }

    // =====================================
    // DETALLE USUARIO
    // =====================================

    obtenerDetalleUsuario(

        tipoUsuario: string,

        id: number

    ): Observable<any> {

        return this.http.get(

            `${this.apiUrl}/usuarios/${tipoUsuario}/${id}`

        );

    }

    // =====================================
    // ACTUALIZAR USUARIO
    // =====================================

    actualizarUsuario(

        tipoUsuario: string,

        id: number,

        datos: any

    ){

        return this.http.put(

            `${this.apiUrl}/usuarios/${tipoUsuario}/${id}`,

            datos

        );

    }

    // =====================================
    // CAMBIAR CONTRASEÑA
    // =====================================

    cambiarPassword(

        tipoUsuario:string,

        id:number,

        password:string

    ){

        return this.http.put(

            `${this.apiUrl}/usuarios/${tipoUsuario}/${id}/password`,

            {

                password

            }

        );

    }

    // =====================================
    // DESACTIVAR USUARIO
    // =====================================

    desactivarUsuario(

        tipoUsuario:string,

        id:number

    ){

        return this.http.put(

            `${this.apiUrl}/usuarios/${tipoUsuario}/${id}/desactivar`,

            {}

        );

    }

    // =====================================
    // ELIMINAR USUARIO
    // =====================================

    eliminarUsuario(

        tipoUsuario: string,

        id: number

    ){

        return this.http.delete(

            `${this.apiUrl}/usuarios/${tipoUsuario}/${id}`

        );

    }

    // =====================================
    // ROLES
    // =====================================

    obtenerRoles(){

        return this.http.get(

            `${this.apiUrl}/roles`

        );

    }

    // =====================================
    // CREAR USUARIO
    // =====================================

    crearUsuario(

        datos:any

    ){

        return this.http.post(

            `${this.apiUrl}/usuarios`,

            datos

        );

    }

    obtenerPreguntas(

        idNivel?: number,

        idProfesor?: number,

        idCompetencia?: number,

        idSubmodulo?: number,

        idTema?: number

    ){

        let params:any = {};

        if(idNivel){

            params.id_nivel = idNivel;

        }

        if(idProfesor){

            params.id_profesor = idProfesor;

        }

        if(idCompetencia){

            params.id_competencia = idCompetencia;

        }

        if(idSubmodulo){

            params.id_submodulo = idSubmodulo;

        }

        if(idTema){

            params.id_tema = idTema;

        }

        return this.http.get(

            `${this.apiUrl}/preguntas`,

            { params }

        );

    }

    obtenerDetallePregunta(idPregunta:number){

        return this.http.get(

            `${this.apiUrl}/preguntas/${idPregunta}`

        );

    }

    actualizarPreguntaAdmin(

        idPregunta: number,

        datos: any

    ){

        return this.http.put(

            `${this.apiUrl}/preguntas/${idPregunta}`,

            datos

        );

    }

    cambiarEstadoPregunta(
        idPregunta:number
    ){

        return this.http.patch(

            `${this.apiUrl}/preguntas/${idPregunta}/estado`,

            {}

        );

    }

    eliminarPregunta(
        idPregunta:number
    ){

        return this.http.delete(

            `${this.apiUrl}/preguntas/${idPregunta}`

        );

    }

}
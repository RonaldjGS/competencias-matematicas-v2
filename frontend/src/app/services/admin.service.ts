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

    

}
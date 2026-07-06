import {

  Injectable

} from '@angular/core';

import {

  HttpClient

} from '@angular/common/http';

import {

  Observable

} from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class AdminService {

    private apiUrl =

        'http://localhost:8000/admin';

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

}
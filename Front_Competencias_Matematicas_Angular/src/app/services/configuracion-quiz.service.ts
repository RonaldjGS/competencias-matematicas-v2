import {

    Injectable

} from '@angular/core';

import {

    HttpClient,

    HttpHeaders,

    HttpParams

} from '@angular/common/http';

import {

    Observable

} from 'rxjs';

@Injectable({

    providedIn:'root'

})

export class ConfiguracionQuizService{

    private api =

        'http://127.0.0.1:8000/configuracion-quiz';

    constructor(

        private http:HttpClient

    ){}

    //==========================================
    // TOKEN
    //==========================================

    private getHeaders(){

        const token =

            localStorage.getItem(

                'token_profesor'

            );

        return{

            headers:new HttpHeaders({

                Authorization:`Bearer ${token}`

            })

        };

    }

    //==========================================
    // GUARDAR CONFIGURACIÓN
    //==========================================

    guardarConfiguracion(
        data:any
    ):Observable<any>{

        return this.http.post(

            `${this.api}/guardar`,

            data,

            this.getHeaders()

        );

    }

    //==========================================
    // OBTENER CONFIGURACIÓN
    //==========================================

    obtenerConfiguracion(

        idCompetencia:number,

        idSubmodulo:number,

        idTema:number,

        dificultad:string

    ):Observable<any>{

        const params =

            new HttpParams()

            .set(

                'id_competencia',

                idCompetencia

            )

            .set(

                'id_submodulo',

                idSubmodulo

            )

            .set(

                'id_tema',

                idTema

            )

            .set(

                'dificultad',

                dificultad

            );

        return this.http.get(

            `${this.api}/obtener`,

            {

                params,

                headers:

                this.getHeaders().headers

            }

        );

    }

    //==========================================
    // CAMBIAR ESTADO
    //==========================================

    cambiarEstado(

        idConfiguracion:number

    ):Observable<any>{

        return this.http.patch(

            `${this.api}/estado/${idConfiguracion}`,

            {},

            this.getHeaders()

        );

    }



}
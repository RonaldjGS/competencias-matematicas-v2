import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  HttpHeaders
} from '@angular/common/http';

import {
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl =
    'http://127.0.0.1:8000';

  constructor(

    private http: HttpClient,

    @Inject(PLATFORM_ID)
    private platformId: Object

  ) {}

  // =====================================
  // GENERAR QUIZ
  // =====================================

  generarQuiz(
    datos: any
    ): Observable<any> {

    return this.http.post(

        `${this.apiUrl}/quiz/generar`,
        datos,

        this.getHeaders()

    );

    }


  // =====================================
  // RESPONDER
  // =====================================

  responderPregunta(
    datos: any
  ): Observable<any> {

    return this.http.post(

    `${this.apiUrl}/quiz/responder`,

    datos,

    this.getHeaders()

    );

  }

  reintentarPregunta(datos:any){

    return this.http.post(

        this.apiUrl + '/quiz/reintentar',

        datos

    );

  }

  continuarPregunta(datos:any){

      return this.http.post(

          this.apiUrl + '/quiz/continuar',

          datos

      );

  }

 // =====================================
  // CALIFICAR
  // =====================================

  calificarQuiz(
    datos: any
  ): Observable<any> {

    return this.http.post(

    `${this.apiUrl}/quiz/calificar`,

    datos,

    this.getHeaders()

    );

  }

  private getHeaders() {

    let token = '';

    if (

        isPlatformBrowser(
        this.platformId
        )

    ) {

        token =

        localStorage.getItem(
            'token_estudiante'
        ) || '';

    }

    return {

        headers: new HttpHeaders({

        Authorization:
            `Bearer ${token}`

        })

    };

  }

  // =====================================
  // FINALIZAR QUIZ
  // =====================================

  finalizarQuiz(datos: any){

    return this.http.post(

      this.apiUrl + '/quiz/finalizar',

      datos

    );

  }

  finalizarSubmodulo(
    datos: any
  ){

      return this.http.post(

          this.apiUrl + '/quiz/finalizar-submodulo',

          datos

      );

  }

}
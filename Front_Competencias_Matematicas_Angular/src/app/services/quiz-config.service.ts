 import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizConfigService {

  // =====================================
  // CONFIGURACIÓN DEL QUIZ
  // =====================================

  idEstudiante:
  number | null = null;

  idNivel:
  number | null = null;

  idCompetencia:
  number | null = null;

  idSubmodulo:
  number | null = null;

  idTema:
  number | null = null;

  dificultad:
  string | null = null;

  // =====================================
  // SETTERS
  // =====================================

  setEstudiante(
    idEstudiante: number
  ): void {

    this.idEstudiante = idEstudiante;

  } 
  
  setNivel(
    idNivel: number
  ): void {

    this.idNivel = idNivel;

  }

  setCompetencia(
    idCompetencia: number
  ): void {

    this.idCompetencia =
      idCompetencia;

  }

  setSubmodulo(
    idSubmodulo: number
  ): void {

    this.idSubmodulo =
      idSubmodulo;

  }

  setTema(
    idTema: number
  ): void {

    this.idTema =
      idTema;

  }

  setDificultad(
    dificultad: string
  ): void {

    this.dificultad =
      dificultad;

  }

  // =====================================
  // GET CONFIG
  // =====================================

  obtenerConfiguracion() {

    return {

      idEstudiante:
      this.idEstudiante,

      idNivel:
      this.idNivel,

      idCompetencia:
      this.idCompetencia,

      idSubmodulo:
      this.idSubmodulo,

      idTema:
      this.idTema,

      dificultad:
      this.dificultad

    };

  }

  // =====================================
  // LIMPIAR
  // =====================================

  limpiar(): void {

    this.idNivel = null;

    this.idCompetencia = null;

    this.idSubmodulo = null;

    this.idTema = null;

    this.dificultad = null;

  }

}
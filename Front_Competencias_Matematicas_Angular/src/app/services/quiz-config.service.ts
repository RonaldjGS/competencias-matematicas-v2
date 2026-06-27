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

  nombreNivel:
  string | null = null;

  idCompetencia:
  number | null = null;

  nombreCompetencia:
  string | null = null;

  idSubmodulo:
  number | null = null;

  nombreSubmodulo:
  string | null = null;

  idTema:
  number | null = null;

  nombreTema:
  string | null = null;

  dificultad:
  string | null = null;

  // =====================================
  // SETTERS
  // =====================================

  setEstudiante(
    idEstudiante: number
  ): void {

    this.idEstudiante =
      idEstudiante;

  }

  setNivel(
    idNivel: number
  ): void {

    this.idNivel =
      idNivel;

  }

  setNombreNivel(
    nombreNivel: string
  ): void {

    this.nombreNivel =
      nombreNivel;

  }

  setCompetencia(
    idCompetencia: number
  ): void {

    this.idCompetencia =
      idCompetencia;

  }

  setNombreCompetencia(
    nombreCompetencia: string
  ): void {

    this.nombreCompetencia =
      nombreCompetencia;

  }

  setSubmodulo(
    idSubmodulo: number
  ): void {

    this.idSubmodulo =
      idSubmodulo;

  }

  setNombreSubmodulo(
    nombreSubmodulo: string
  ): void {

    this.nombreSubmodulo =
      nombreSubmodulo;

  }

  setTema(
    idTema: number
  ): void {

    this.idTema =
      idTema;

  }

  setNombreTema(
    nombreTema: string
  ): void {

    this.nombreTema =
      nombreTema;

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

      nombreNivel:
      this.nombreNivel,

      idCompetencia:
      this.idCompetencia,

      nombreCompetencia:
      this.nombreCompetencia,

      idSubmodulo:
      this.idSubmodulo,

      nombreSubmodulo:
      this.nombreSubmodulo,

      idTema:
      this.idTema,

      nombreTema:
      this.nombreTema,

      dificultad:
      this.dificultad

    };

  }

  // =====================================
  // LIMPIAR
  // =====================================

  limpiar(): void {

    this.idEstudiante = null;

    this.idNivel = null;

    this.nombreNivel = null;

    this.idCompetencia = null;

    this.nombreCompetencia = null;

    this.idSubmodulo = null;

    this.nombreSubmodulo = null;

    this.idTema = null;

    this.nombreTema = null;

    this.dificultad = null;

  }

}
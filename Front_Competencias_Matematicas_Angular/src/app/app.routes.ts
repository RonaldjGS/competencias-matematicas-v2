import { Routes } from '@angular/router';

import {
  LoginEstudianteComponent
} from './pages/auth/login-estudiante/login-estudiante.component';

import {
  RegistroEstudianteComponent
} from './pages/auth/registro-estudiante/registro-estudiante.component';

import {
  LoginProfesorComponent
} from './pages/auth/login-profesor/login-profesor.component';

import {
  RegistroProfesorComponent
} from './pages/auth/registro-profesor/registro-profesor.component';

import {
  DashboardProfesorComponent
} from './pages/dashboard-profesor/dashboard-profesor.component';

import {
  PreguntasComponent
} from './pages/preguntas/preguntas.component';

import {

  DashboardEstudianteComponent

} from './pages/dashboard-estudiante/dashboard-estudiante.component';

import {
  SeleccionarCompetenciaComponent
} from './pages/estudiante/seleccionar-competencia/seleccionar-competencia.component';

import {
  SeleccionarModalidadComponent
}
from './pages/estudiante/seleccionar-modalidad/seleccionar-modalidad.component';

import {
  SeleccionarTemaComponent
}
from './pages/estudiante/seleccionar-tema/seleccionar-tema.component';

import {
  SeleccionarDificultadComponent
} from './pages/estudiante/seleccionar-dificultad/seleccionar-dificultad.component';

import {
  VideoIntroductorioComponent
} from './pages/estudiante/video-introductorio/video-introductorio.component';

import {
  QuizComponent
} from './pages/estudiante/quiz/quiz.component';

import {
  ResultadoQuizComponent
} from './pages/estudiante/resultado-quiz/resultado-quiz.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login-estudiante',
    pathMatch: 'full'
  },

  {
  path: 'login-estudiante',
  component: LoginEstudianteComponent
  },

  {
  path: 'registro-estudiante',
  component: RegistroEstudianteComponent
  },

  {
  path: 'login-profesor',
  component: LoginProfesorComponent
  },

  {
    path: 'registro-profesor',
    component: RegistroProfesorComponent
  },

  //{
    //path: 'login-admin',
    //component: LoginAdminComponent
  //}

  {
    path: 'dashboard-profesor',
    component: DashboardProfesorComponent
  },

  {
    path: 'preguntas',
    component: PreguntasComponent
  },

  {
  path: 'dashboard-estudiante',
  component: DashboardEstudianteComponent
  },

  {
  path: 'seleccionar-competencia',
  component: SeleccionarCompetenciaComponent
  },

  {
  path: 'seleccionar-modalidad',
  component: SeleccionarModalidadComponent
  },

  {
  path: 'seleccionar-tema',
  component: SeleccionarTemaComponent
  },

  {
  path: 'seleccionar-dificultad',
  component: SeleccionarDificultadComponent
  },

  {
  path: 'video-introductorio',
  component: VideoIntroductorioComponent
  },

  {
  path: 'quiz',
  component: QuizComponent
  },

  {
    path: 'resultado-quiz/:id',
    component: ResultadoQuizComponent
}


];
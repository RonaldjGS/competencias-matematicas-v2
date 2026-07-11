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
  LoginAdminComponent
} from './pages/auth/login-admin/login-admin.component';

import {
  DashboardAdminComponent
} from './pages/administrador/dashboard-admin/dashboard-admin.component';

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

import {
  ProgresoEstudianteComponent
} from './pages/estudiante/progreso-estudiante/progreso-estudiante.component';

import {
  EstudianteProfesorComponent
} from './pages/profesor/estudiante-profesor/estudiante-profesor.component';

import {
  PerfilEstudianteProfesorComponent
} from './pages/profesor/perfil-estudiante-profesor/perfil-estudiante-profesor.component';

import {
  VideoProfesorComponent
} from './pages/profesor/video-profesor/video-profesor.component';

import {
  HistorialEstudianteComponent
} from './pages/estudiante/historial-estudiante/historial-estudiante.component';

import {
  ImportarPreguntasComponent
} from './pages/preguntas/importar-preguntas/importar-preguntas.component';

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

  {
    path: 'login-admin',
    component: LoginAdminComponent
  },

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
  },

  {
    path: 'progreso-estudiante',
    component: ProgresoEstudianteComponent
  },

  {
    path: 'estudiante-profesor',
    component: EstudianteProfesorComponent
  },

  {
    path: 'perfil-estudiante-profesor/:id',
    component: PerfilEstudianteProfesorComponent
  },

  {
    path: 'video-profesor',
    component: VideoProfesorComponent
  },

  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent
  },

  {
    path: 'historial-estudiante',
    component: HistorialEstudianteComponent
  },

  {
    path: 'importar-pregunta',
    component: ImportarPreguntasComponent
  },

];
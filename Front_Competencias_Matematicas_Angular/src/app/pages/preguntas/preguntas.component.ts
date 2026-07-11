import {
    Component,
    OnInit
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    TopbarProfesorComponent
} from '../../components/topbar-profesor/topbar-profesor.component';

import {
    SidebarProfesorComponent
} from '../../components/sidebar-profesor/sidebar-profesor.component';

import {
    ImportarPreguntasComponent
} from './importar-preguntas/importar-preguntas.component';

import {

    BancoPreguntasComponent

} from './banco-preguntas/banco-preguntas.component';

import {

    ConfiguracionQuizComponent

} from './configuracion-quiz/configuracion-quiz.component';

@Component({

    selector:'app-preguntas',

    standalone:true,

    imports:[

        CommonModule,

        TopbarProfesorComponent,

        SidebarProfesorComponent,

        ImportarPreguntasComponent,

        BancoPreguntasComponent,
        
        ConfiguracionQuizComponent

    ],

    templateUrl:'./preguntas.component.html',

    styleUrl:'./preguntas.component.css'

})

export class PreguntasComponent
implements OnInit{

    menuAbierto = false;

    nombreProfesor = '';

    tituloPagina = 'Importar Banco de Preguntas';

    descripcionPagina =
    'Carga masiva de preguntas desde un archivo Excel.';

    pestanaActual:
    'importar'|'banco'|'quiz'='importar';

    ngOnInit():void{

        this.nombreProfesor =

            localStorage.getItem(

                'nombre_profesor'

            ) || 'Profesor';

    }

    toggleMenu():void{

        this.menuAbierto =

            !this.menuAbierto;
        console.log(this.menuAbierto);

    }

    cambiarPestana(
        pestana:'importar'|'banco'|'quiz'
    ){

        this.pestanaActual = pestana;

        switch(pestana){

            case 'importar':

                this.tituloPagina =
                    'Importar Banco de Preguntas';

                this.descripcionPagina =
                    'Carga masiva de preguntas desde un archivo Excel.';

            break;

            case 'banco':

                this.tituloPagina =
                    'Banco de Preguntas';

                this.descripcionPagina =
                    'Visualiza, edita y administra las preguntas registradas.';

            break;

            case 'quiz':

                this.tituloPagina =
                    'Configuración del Quiz';

                this.descripcionPagina =
                    'Administra la configuración general de los cuestionarios.';

            break;

        }

    }

}
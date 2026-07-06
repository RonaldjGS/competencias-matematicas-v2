import { CommonModule } from '@angular/common';

import {

Component,

Input,

Output,

EventEmitter

} from '@angular/core';

import {

Router

} from '@angular/router';

@Component({

selector:'app-sidebar-profesor',

standalone:true,

imports:[
    CommonModule
],

templateUrl:'./sidebar-profesor.component.html',

styleUrl:'./sidebar-profesor.component.css'

})

export class SidebarProfesorComponent{

    @Input()

    menuAbierto=true;

    @Output()

    menuAbiertoChange=

    new EventEmitter<boolean>();

    constructor(

        private router:Router

    ){}

    toggleMenu(){

        this.menuAbierto=

        !this.menuAbierto;

        this.menuAbiertoChange.emit(

            this.menuAbierto

        );

    }

    irInicio(){

        this.router.navigate([

            '/dashboard-profesor'

        ]);

    }

    irPreguntas(){

        this.router.navigate([

            '/preguntas'

        ]);

    }

    irVideos(){

        this.router.navigate([

            '/video-profesor'

        ]);

    }

    irEstudiantes(){

        this.router.navigate([

            '/estudiante-profesor'

        ]);

    }
    

    cerrarSesion(){

        localStorage.clear();

        this.router.navigate([

            '/login-profesor'

        ]);

    }

}
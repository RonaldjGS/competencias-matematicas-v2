import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

@Component({

  selector:'app-topbar-profesor',

  standalone:true,

  imports:[
    CommonModule
  ],

  templateUrl:'./topbar-profesor.component.html',

  styleUrl:'./topbar-profesor.component.css'

})

export class TopbarProfesorComponent{

    @Input()

    nombreProfesor='Profesor';

}
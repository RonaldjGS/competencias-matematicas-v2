import { CommonModule } from '@angular/common';

import {

  Component,

  EventEmitter,

  Output,

  Input

} from '@angular/core';

import {

  Router

} from '@angular/router';

@Component({

  selector:'app-sidebar-estudiante',

  standalone:true,

  imports: [
    CommonModule
  ],

  templateUrl:'./sidebar-estudiante.component.html',

  styleUrl:'./sidebar-estudiante.component.css'

})

export class SidebarEstudianteComponent{

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

  cerrarSesion(){

    localStorage.clear();

    this.router.navigate([

      '/login-estudiante'

    ]);

  }

}
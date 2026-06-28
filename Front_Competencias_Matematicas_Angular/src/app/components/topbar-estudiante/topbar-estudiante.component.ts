import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({

  selector:'app-topbar-estudiante',

  standalone:true,

  imports: [CommonModule],

  templateUrl:'./topbar-estudiante.component.html',

  styleUrl:'./topbar-estudiante.component.css'

})

export class TopbarEstudianteComponent{

  @Input()

  nombreEstudiante='Estudiante';

}
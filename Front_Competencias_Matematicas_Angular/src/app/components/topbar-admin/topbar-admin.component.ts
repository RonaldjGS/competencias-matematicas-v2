import {

  Component,

  Input

} from '@angular/core';

import {

  CommonModule

} from '@angular/common';

@Component({

  selector: 'app-topbar-admin',

  standalone: true,

  imports: [

    CommonModule

  ],

  templateUrl: './topbar-admin.component.html',

  styleUrl: './topbar-admin.component.css'

})

export class TopbarAdminComponent {

  @Input()

  nombreAdministrador = 'Administrador';

}
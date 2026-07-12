import {

  CommonModule

} from '@angular/common';

import {

  Component,

  EventEmitter,

  Input,

  Output

} from '@angular/core';

import {

  Router

} from '@angular/router';

@Component({

  selector: 'app-sidebar-admin',

  standalone: true,

  imports: [

    CommonModule

  ],

  templateUrl: './sidebar-admin.component.html',

  styleUrl: './sidebar-admin.component.css'

})

export class SidebarAdminComponent {

  @Input()

  menuAbierto = false;

  @Output()

  menuAbiertoChange =

    new EventEmitter<boolean>();

  constructor(

    private router: Router

  ) {}

  toggleMenu(): void {

    this.menuAbierto =

      !this.menuAbierto;

    this.menuAbiertoChange.emit(

      this.menuAbierto

    );

  }

  irDashboard(): void {

    this.router.navigate([

      '/dashboard-admin'

    ]);

  }

  irPreguntas(): void {

    this.router.navigate([

      '/preguntas-admin'

    ]);

  }

  irVideos(): void {

    this.router.navigate([

      '/videos-admin'

    ]);

  }

  irEstadisticas(): void {

    this.router.navigate([

      '/estadisticas-admin'

    ]);

  }

  cerrarSesion(): void {

    localStorage.clear();

    this.router.navigate([

      '/login-admin'

    ]);

  }

}
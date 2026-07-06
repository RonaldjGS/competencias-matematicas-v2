import {

  Component

} from '@angular/core';

import {

  CommonModule

} from '@angular/common';

import {

  FormsModule

} from '@angular/forms';

import {

  Router

} from '@angular/router';

import {

  AuthAdminService

} from '../../../services/auth-admin.service';

@Component({

  selector: 'app-login-admin',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule

  ],

  templateUrl: './login-admin.component.html',

  styleUrl: './login-admin.component.css'

})

export class LoginAdminComponent {

    correo = '';

    password = '';

    mostrarPassword = false;

    constructor(

        private authService: AuthAdminService,

        private router: Router

    ) {}

    // =====================================
    // NAVEGACIÓN ENTRE LOGINS
    // =====================================

    irLoginEstudiante(): void {

        this.router.navigate([

            '/login-estudiante'

        ]);

    }

    irLoginProfesor(): void {

        this.router.navigate([

            '/login-profesor'

        ]);

    }

    irLoginAdmin(): void {

        this.router.navigate([

            '/login-admin'

        ]);

    }

    // =====================================
    // MOSTRAR CONTRASEÑA
    // =====================================

    togglePassword(): void {

        this.mostrarPassword =

            !this.mostrarPassword;

    }

    // =====================================
    // LOGIN
    // =====================================

    loginAdmin(): void {

        if (

            !this.correo ||

            !this.password

        ) {

            alert(

                'Debe ingresar correo y contraseña'

            );

            return;

        }

        const datos = {

            correo: this.correo,

            password: this.password

        };

        this.authService

            .login(

                datos

            )

            .subscribe({

                next: (response: any) => {

                    console.log(

                        response

                    );

                    localStorage.setItem(

                        'token_admin',

                        response.access_token

                    );

                    localStorage.setItem(

                        'id_admin',

                        response.usuario.id_admin.toString()

                    );

                    localStorage.setItem(

                        'nombre_admin',

                        response.usuario.nombre_admin

                    );

                    this.router.navigate([

                        '/dashboard-admin'

                    ]);

                },

                error: () => {

                    alert(

                        'Correo o contraseña incorrectos'

                    );

                }

            });

    }

}
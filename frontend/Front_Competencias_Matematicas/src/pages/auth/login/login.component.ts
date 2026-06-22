import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  mostrarPassword = false;

  togglePassword(): void {
    this.mostrarPassword =
      !this.mostrarPassword;
  }

}
import {

  Injectable

} from '@angular/core';

import {

  HttpClient

} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({

  providedIn: 'root'

})

export class AuthAdminService {

  private apiUrl =

     `${environment.apiUrl}/auth/admin`;

  constructor(

    private http: HttpClient

  ) {}

  // =====================================
  // LOGIN
  // =====================================

  login(

    datos: any

  ) {

    return this.http.post(

      `${this.apiUrl}/login`,

      datos

    );

  }

}
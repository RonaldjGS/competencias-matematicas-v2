import {

  Injectable

} from '@angular/core';

import {

  HttpClient

} from '@angular/common/http';

@Injectable({

  providedIn: 'root'

})

export class AuthAdminService {

  private apiUrl =

    'http://localhost:8000/auth/admin';

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
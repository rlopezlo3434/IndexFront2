import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private apiUrl = 'http://localhost:3000/api/auth/login'; 
  private apiUrl = environment.apiUrl; // URL de la API

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(email: string, password: string) {
    return this.http.post(
      this.apiUrl + '/auth/login', 
      { email, password },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  logout(): void {
    // Aquí puedes implementar la lógica para cerrar sesión, como eliminar el token de autenticación del almacenamiento local
    localStorage.removeItem('authToken');
  }


  isAuthenticated(token: string | null): boolean {
    // Aquí deberías verificar si el token es válido
    return !!token; // Simplemente verifica que el token no sea null
  }
}

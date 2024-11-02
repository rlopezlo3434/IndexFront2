import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleUsuarioService {

  private apiUrl = environment.apiUrl; // URL de la API

  constructor(private http: HttpClient) { }

  obtenerDetalleUsuario(params: any): Observable<any> {
  // http://localhost:3000/api/clienteDetalle

    console.log('params', params);
    return this.http.post(
      this.apiUrl + '/clienteDetalle', 
      { params },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }
}

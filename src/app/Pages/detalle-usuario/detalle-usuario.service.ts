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

  agregarHistorico(params: any): Observable<any> {
    console.log('params', params);
    return this.http.post(this.apiUrl + '/agregarHistorico', { params },
      { withCredentials: true });
  }

  obtenerHistorico(params: any): Observable<any> {
    return this.http.post(this.apiUrl + '/historicoUsuario', { params },
      { withCredentials: true });
  }

  updatePassword(params: any): Observable<any> {
    return this.http.post(this.apiUrl + '/actualizarPass', { params },
      { withCredentials: true });
  }

  updateEstado(params: any): Observable<any> {
    return this.http.post(this.apiUrl + '/actualizarEstado', { params },
      { withCredentials: true });
  }

  updateDocumento(params: any): Observable<any> {
    return this.http.post(this.apiUrl + '/actualizarDocumento', { params },
      { withCredentials: true });
  }
}

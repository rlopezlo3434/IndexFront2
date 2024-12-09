import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { clippingParents } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = environment.apiUrl; // URL de la API

  constructor(private http: HttpClient) { }

  registrarCliente(params: any): Observable<any> {
    console.log('params', params);
    return this.http.post(
      this.apiUrl + '/registrar', 
      { params },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  obtenerClientes(asesor: any): Observable<any> {
    return this.http.post(
      this.apiUrl + '/asesor',
      { asesor },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  obtenerReporte(): Observable<any> {
    return this.http.post(
      this.apiUrl + '/clientes',
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  registrarInversion(params: any): Observable<any> {
    console.log('params', params);
    return this.http.post(
      this.apiUrl + '/registrarInversion', 
      { params },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  registrarAsesor(params: any): Observable<any> {
    console.log('params', params);
    return this.http.post(
      this.apiUrl + '/registrarAsesor', 
      { params },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  obtenerAsesores(): Observable<any> {
    return this.http.post(
      this.apiUrl + '/asesores',
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalisisService {

  private apiUrl = environment.apiUrl; // URL de la API

  constructor(private http: HttpClient) { }


  obtenerDatosEmpresa(): Observable<any> {
    // http://localhost:3000/api/clienteDetalle

    return this.http.post(
      this.apiUrl + '/analisisPie',
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  obtenerNuevoCliente(params: any): Observable<any> {
    // http://localhost:3000/api/clienteDetalle

    return this.http.post(
      this.apiUrl + '/analisisNewClientes',
      { params },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  obtenerPorVencer(): Observable<any> {
    // http://localhost:3000/api/clienteDetalle

    return this.http.post(
      this.apiUrl + '/analisisInversionesPorVencer',
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  obtenerVencidos(params: any): Observable<any> {
    // http://localhost:3000/api/clienteDetalle

    return this.http.post(
      this.apiUrl + '/analisisInversionesVencidas',
      { params },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  private apiUrl = environment.apiUrl; // URL de la API


  constructor(private http: HttpClient) { }

  obtenerClientes(params: any): Observable<any> {
    console.log('params', params);
    return this.http.post(
      this.apiUrl + '/clienteAsesor', 
      { params },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }

  exportarExcel(): Observable<any> {
    return this.http.post(
      this.apiUrl + '/clientes', 
      {  },
      { withCredentials: true } // Incluye las credenciales en la solicitud
    );
  }
}

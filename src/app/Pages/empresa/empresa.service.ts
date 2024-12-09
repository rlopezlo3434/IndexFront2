import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = environment.apiUrl; // URL de la API

  constructor(private http: HttpClient) { }

  // Crear una nueva empresa
  crearEmpresa(nombre: string, value: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresa/crear`, { nombre, value });
  }

  // Obtener todas las empresas
  obtenerEmpresas(): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresas/obtener`, {});
  }

  // Actualizar una empresa
  actualizarEmpresa(id: number, nombre: string, value: string): Observable<any> {
    console.log('Actualizar empresa', id, nombre, value);
    return this.http.post(`${this.apiUrl}/empresa/actualizar`, { id, nombre, value });
  }

  // Eliminar una empresa
  eliminarEmpresa(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresa/eliminar`, { id });
  }
}

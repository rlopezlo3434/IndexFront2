import { Component } from '@angular/core';
import { EmpresaService } from './empresa.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent {
  // Lista de empresas (simulando datos locales)
  // empresas = [
  //   { id: 1, nombre: 'Empresa A' },
  //   { id: 2, nombre: 'Empresa B' },
  //   { id: 3, nombre: 'Empresa C' }
  // ];

  empresas: any[] = [];
  // Variable para almacenar los datos de la empresa a editar
  empresa: { id?: number, nombre: string, value: string } = { nombre: '', value: '' };

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    // Cualquier inicialización si fuera necesario
    this.obtenerEmpresas();
  }

  // Obtener todas las empresas
  obtenerEmpresas() {
    this.empresaService.obtenerEmpresas()
      .subscribe(response => {
        this.empresas = response.data;
      });
  }
  // Crear o actualizar una empresa
  guardarEmpresa(empresaNombre: HTMLInputElement) {
    console.log('Guardar empresa', empresaNombre.value);
    const value = this.convertirNombreConGuiones(empresaNombre.value);
    if (this.empresa.id) {
      // Actualizar empresa
      this.empresaService.actualizarEmpresa(this.empresa.id, empresaNombre.value, value)
        .subscribe(response => {
          console.log('Empresa actualizada', response);
          this.obtenerEmpresas(); // Actualizar lista de empresas
          this.empresa.id = undefined; // Limpiar el id
          this.limpiarFormulario(empresaNombre)
        });
    } else {
      // Crear nueva empresa
      console.log('Crear empresa', this.empresa);
      this.empresaService.crearEmpresa(empresaNombre.value, value)
        .subscribe(response => {
          console.log('Empresa creada', response);
          this.obtenerEmpresas(); // Actualizar lista de empresas
          this.limpiarFormulario(empresaNombre);
        });
    }
  }

  // Función para editar una empresa
  editarEmpresa(empresa: any) {
    console.log('Editar empresa', empresa);
    this.empresa = { ...empresa };
  }
  // Eliminar una empresa
  eliminarEmpresa(id: number) {
    console.log(id)
    this.empresaService.eliminarEmpresa(id)
      .subscribe(response => {
        console.log('Empresa eliminada', response);
        this.obtenerEmpresas(); // Actualizar lista de empresas
      });
  }

  // Función que convierte el nombre con espacios a guiones bajos
  convertirNombreConGuiones(nombre: string): string {
    return nombre.replace(/ /g, '_');
  }

  // Limpiar el formulario
  limpiarFormulario(empresaNombre: HTMLInputElement) {
    empresaNombre.value = ''; // Limpiar campo nombre
  }
}

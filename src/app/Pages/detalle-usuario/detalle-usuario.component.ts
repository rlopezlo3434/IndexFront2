import { Component, OnInit } from '@angular/core';
import { DetalleUsuarioService } from './detalle-usuario.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {
  updateDocument: boolean = false;
  displayedColumns: string[] = ['Editar', 'Estado', 'Tipo', 'Fechas', 'Empresa', 'Monto', 'Rentabilidad', 'Frecuencia', 'Documentos'];
  observacion: string = '';
  hoy: Date = new Date();
  personDetalle: any = {};
  personInversion: any = {};
  totalsoles: number = 0;
  totaldolares: number = 0;
  vista: boolean = false;
  historico: any = [];
  // rowSelect: any = { };
  selectedFile: any = null;
  isEditing: boolean = false;
  selectedEstado: string = '';
  rowSelect = {
    "nombre2": "Melina",
    "apellido2": "Metritian Cover",
    "phone2": "546-933-2772",
    "email2": "jaskolski.brent@yahoo.com",
    "fecha_nacimiento2": "1995-08-11",
    "dni2": "46553345",
    "nombre3": "Carlos",
    "apellido3": "Perez Gonzalez",
    "phone3": "546-933-1234",
    "email3": "carlos.perez@example.com",
    "fecha_nacimiento3": "1990-05-22",
    "dni3": "12345678"
  }


  // dataSource = [
  //   { Estado: 'Activo', Tipo: 'A', Fechas: '01/01/2023', Empresa: 'Empresa 1', Monto: 100, Rentabilidad: '10%', Frecuencia: 'Mensual', Documentos: 'Documento 1' },
  //   { Estado: 'Inactivo', Tipo: 'B', Fechas: '02/02/2023', Empresa: 'Empresa 2', Monto: 200, Rentabilidad: '20%', Frecuencia: 'Anual', Documentos: 'Documento 2' }
  // ];
  constructor(private detalleUsuarioService: DetalleUsuarioService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerDetalleUsuario();
    this.obtenerHistorico();
  }

  obtenerDetalleUsuario() {
    const clienteData = localStorage.getItem('cliente');
    const cliente = clienteData ? JSON.parse(clienteData) : null;
    const params = {
      id: cliente.user_id
    };

    this.detalleUsuarioService.obtenerDetalleUsuario(params).subscribe(
      (response: any) => {
        this.personDetalle = response.cliente.usuario;
        this.personInversion = response.cliente.inversiones;

        this.personInversion.forEach((item: any) => {

          this.totalsoles += parseFloat(item.monto_soles);
          this.totaldolares += parseFloat(item.monto_dolares);
        }
        );
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
  toggleRow(element: any) {
    element.expanded = !element.expanded;
  }

  gotoDocumentos(element: any) {
    // if(element.nombre2 !== "" && element.nombre3 !== ""){
    //   this.vista = true
    // }
    if (element.nombre2 !== "" && element.nombre3 !== "") {
      this.vista = true;
      this.rowSelect = element;
    }
    else {
      this.vista = false
    }
  }

  descargarDocumento(documentoData: { type: string; data: number[] }, nombreArchivo: string) {
    // Convierte el array de datos a un Blob con el tipo MIME correcto
    const byteArray = new Uint8Array(documentoData.data);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }); // Tipo MIME para .docx

    // Crea un enlace para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Documento'; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Liberar el objeto URL
  }

  isNearExpiration(fechaVencimiento: string): boolean {
    const fechaVencimientoDate = new Date(fechaVencimiento);
    const diffTime = fechaVencimientoDate.getTime() - this.hoy.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24); // Convertir milisegundos a días

    return diffDays <= 60 && diffDays >= 0; // Verifica si está entre 0 y 60 días
  }

  backpage() {
    this.router.navigate(['..']); // Navegar a la ruta anterior
  }

  redirigirAReporte() {
    // this.router.navigateByUrl('dashboard/reporte');
    this.router.navigate(['dashboard/reporte']);
  }
  actualizarObservacion(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.observacion = inputElement.value;
  }
  agregarObservacion() {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;

    if (this.observacion.trim()) {

      const params =
      {
        "userId": user.id,
        "texto": this.observacion
      }
      this.detalleUsuarioService
        .agregarHistorico(params)
        .subscribe({
          next: (response) => {
            console.log('Observación agregada:', response);
            this.observacion = ''; // Limpia el input después de agregar
            this.obtenerHistorico();
          },
          error: (error) => {
            console.error('Error al agregar observación:', error);
          },
        });
    } else {
      alert('Por favor, escribe una observación válida.');
    }
  }

  obtenerHistorico() {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    const params =
    {
      "userId": user.id,
    }
    this.detalleUsuarioService.obtenerHistorico(params).subscribe(
      (response: any) => {
        this.historico = response.data
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
  enableEditMode(): void {
    this.isEditing = true;
  }

  saveEdit(element: any): void {
    const params = {
      "id": element.id,
      "estado": this.selectedEstado
    }
    this.detalleUsuarioService.updateEstado(params).subscribe(
      (response: any) => {
        this.obtenerDetalleUsuario();
        this.toastr.success('Estado cambiado correctamente!', 'Index!');
        this.isEditing = false;

      },
      (error: any) => {
        this.toastr.error('No se pudo cambiar el estado correctamente!', 'Index!');
      }
    );
  }

  cancelEdit(element: any): void {
    // Opción para cancelar edición (podrías restaurar el estado original si lo guardas antes)
    this.isEditing = false;
  }

  onStateChange(event: any): void {
    this.selectedEstado = event.target.value;
  }
  ActualizarDocumento() {
    this.updateDocument = true;
    console.log('Actualizar documento');
  }

  cancelUpdate(element: any): void {
    // Opción para cancelar edición (podrías restaurar el estado original si lo guardas antes)
    this.updateDocument = false;
  }

  saveUpdate(element: any): void {
    this.updateDocument = false;

    const params = {
      id: element.id,
      documento: this.selectedFile?.contenido,
      nombre_documento: this.selectedFile?.nombre,
      tipo_documento: this.selectedFile?.tipo
    };

    this.detalleUsuarioService.updateDocumento(params).subscribe(
      (response: any) => {
        this.personDetalle = null;
        this.totalsoles = 0;
        this.totaldolares = 0;
        this.toastr.success('Documento cambiado correctamente!', 'Index!');
        this.obtenerDetalleUsuario();
        this.updateDocument = false;

      },
      (error: any) => {
        this.toastr.error('No se pudo cambiar el Documento correctamente!', 'Index!');
      }
    );
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    // Convertir el archivo a base64
    const base64 = await this.convertFileToBase64(file);
    this.selectedFile = {
      contenido: base64,
      nombre: file.name,
      tipo: file.type
    };

    console.log('Archivo seleccionado:', this.selectedFile);
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleUsuarioService } from '../detalle-usuario/detalle-usuario.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent {
  displayedColumns: string[] = ['Estado', 'Tipo', 'Fechas', 'Empresa', 'Monto', 'Rentabilidad', 'Frecuencia', 'Documentos'];
  observacion: string = '';
  hoy: Date = new Date();
  personDetalle: any = {};
  personInversion: any = {};
  totalsoles: number = 0;
  totaldolares: number = 0;
  vista: boolean = false;
  historico: any = [];
  role: string = '';
  // rowSelect: any = { };
  isModalOpen = false;

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
    const clienteData = localStorage.getItem('userData');
    const cliente = clienteData ? JSON.parse(clienteData) : null;
    this.role = cliente.rol_id;
    console.log(cliente.id);
    const params = {
      id: cliente.id
    };

    this.detalleUsuarioService.obtenerDetalleUsuario(params).subscribe(
      (response: any) => {
        this.personDetalle = response.cliente.usuario;
        this.personInversion = response.cliente.inversiones.filter((item: any) => item.estado === 'Vigente');

        this.personInversion.forEach((item: any) => {
          console.log('item', item.monto_soles);
          console.log('item', item.monto_dolares);

          this.totalsoles += parseFloat(item.monto_soles);
          this.totaldolares += parseFloat(item.monto_dolares);
        }
        );

        console.log('response', response.cliente.usuario);
        console.log('response', response.cliente.inversiones);
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
    console.log('element', element);
    if (element.nombre2 !== "" && element.nombre3 !== "") {
      console.log('entreeeeeeeee');
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
    a.download = 'CE82_D14A M11B_TF_LOPEZ LOZANO RENZO FERNANDO'; // Nombre del archivo
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
    console.log(user.id);
    console.log(this.observacion);

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
    console.log(user.id);
    const params =
    {
      "userId": user.id,
    }
    this.detalleUsuarioService.obtenerHistorico(params).subscribe(
      (response: any) => {
        console.log('Historico', response);
        this.historico = response.data
        console.log('Historico', this.historico);
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  getBackgroundColor(estado: string): string {
    switch (estado) {
      case 'Vigente':
        return '#a3f7bf'; // Color para "Activo"
      case 'Garantia':
        return '#ff4d4d'; // Color para "Inactivo"
      case 'Vencido':
        return '#ffd700'; // Color para "Pendiente"
      case 'No_Renovado':
        return '#ffd700'; // Color para "Pendiente"
      case 'Renovacion_Anticipada':
        return '#ffd700'; // Color para "Pendiente"
      case 'Cancelado':
        return '#ffd700'; // Color para "Pendiente"
      default:
        return '#d3d3d3'; // Color por defecto
    }
  }

  getBackgroundColorBoton(estado: string): string {
    switch (estado) {
      case 'Vigente':
        return '#4CAF50'; // Color para "Activo"
      case 'Garantia':
        return '#ff4d4d'; // Color para "Inactivo"
      case 'Vencido':
        return '#ffd700'; // Color para "Pendiente"
      case 'No_Renovado':
        return '#ffd700'; // Color para "Pendiente"
      case 'Renovacion_Anticipada':
        return '#ffd700'; // Color para "Pendiente"
      case 'Cancelado':
        return '#ffd700'; // Color para "Pendiente"
      default:
        return '#d3d3d3'; // Color por defecto
    }
  }
  openModal(): void {
    console.log("modal")
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  guardarPassword(password: string): void {
    console.log('Nueva Contraseña:', password);

    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    console.log(user.id);
    const params =
    {
      "userId": user.id,
      "password": password
    }
    this.detalleUsuarioService.updatePassword(params).subscribe(
      (response: any) => {
        console.log('response', response);
        this.toastr.success('Contraseña cambiada correctamente!', 'Index!');
        this.closeModal();

      },
      (error: any) => {
        this.toastr.error('Error al cambiar contraseña!', 'Index!');
        console.log('error', error);
      }
    );

  }


}

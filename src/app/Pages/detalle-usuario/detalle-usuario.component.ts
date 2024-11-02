import { Component, OnInit } from '@angular/core';
import { DetalleUsuarioService } from './detalle-usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {

  displayedColumns: string[] = ['Estado', 'Tipo', 'Fechas', 'Empresa', 'Monto', 'Rentabilidad', 'Frecuencia', 'Documentos'];

  hoy: Date = new Date();
  personDetalle: any = {};
  personInversion: any = {};
  totalsoles: number = 0;
  totaldolares: number = 0;
  vista: boolean = false;
  // rowSelect: any = { };


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
  constructor(private detalleUsuarioService: DetalleUsuarioService,private router: Router) { }

  ngOnInit(): void {
    this.obtenerDetalleUsuario();

  }

  obtenerDetalleUsuario() {
    const clienteData = localStorage.getItem('cliente');
    const cliente = clienteData ? JSON.parse(clienteData) : null;
    console.log(cliente.user_id);
    const params = {
      id: cliente.user_id
    };

    this.detalleUsuarioService.obtenerDetalleUsuario(params).subscribe(
      (response: any) => {
        this.personDetalle = response.cliente.usuario;
        this.personInversion = response.cliente.inversiones;

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

  backpage(){
      this.router.navigate(['..']); // Navegar a la ruta anterior
  }

  redirigirAReporte() {
    // this.router.navigateByUrl('dashboard/reporte');
    this.router.navigate(['dashboard/reporte']);
  }
}

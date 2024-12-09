import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExporService {

  constructor() { }
  exportDataToExcel(data: any[]): void {
    // Transformar datos: agregar información del cliente a cada inversión
    const transformedData = data.flatMap((cliente) =>
      cliente.inversiones.map((inversion: any) => ({
        Nombre: cliente.nombre,
        Apellido: cliente.apellido,
        DNI: cliente.dni,
        Correo: cliente.email,
        "ID Inversión":inversion.id,
        "Empresa":inversion.empresa,
        "Fecha Inicio":inversion.fecha_inicio,
        "Fecha Vencimiento":inversion.fecha_vencimiento,
        "Fondo":inversion.fondo,
        "Estado":inversion.estado,
        "Objetivo":inversion.objetivo,
        "Perfin Inversion":inversion.perfilInversion,
        "Monto Dolares":inversion.monto_dolares,
        "Monto Soles":inversion.monto_soles,
        "Frecuencia":inversion.frecuencia,
        "Rentabilidad":inversion.rentabilidad,
        "Tipo Inversion":inversion.tipoInversion,
        "Nombre Segundo Titular":inversion.nombre2,
        "Apellido Segundo Titular":inversion.apellido2,
        "DNI Segundo Titular":inversion.dni2,
        "Correo Segundo Titular":inversion.email2,
        "Celular Segundo Titular":inversion.phone2,
        "F.Nacimiento Segundo Titular":inversion.fecha_nacimiento2,
        "Nombre Tercer Titular":inversion.nombre3,
        "Apellido Tercer Titular":inversion.apellido3,
        "DNI Tercer Titular":inversion.dni3,
        "Correo Tercer Titular":inversion.email3,
        "Celular Tercer Titular":inversion.phone3,
        "F.Nacimiento Tercer Titular":inversion.fecha_nacimiento3,

      }))
    );

    // Crear la hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CLIENTES_INVERSIONES');

    // Exportar como archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'CLIENTES_INVERSIONES.xlsx');
  }
}

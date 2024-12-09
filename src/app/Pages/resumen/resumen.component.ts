import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ResumenService } from './resumen.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ExporService } from 'src/app/Services/expor.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nombre', 'estado', 'empresa', 'fechasI', 'fechasF', 'monto', 'frecuencia', 'rentabilidad'];
  dataSource = new MatTableDataSource<any>([]);
  totalsoles: number = 0;
  totaldolares: number = 0;
  totalClientes1: number = 0;
  totalClientes2: number = 0;
  hoy: Date = new Date();

  constructor(private resumenService: ResumenService, private router: Router, private exportService: ExporService) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes() {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    console.log(user.id);

    const params = {
      "fechaInicioDesde": "",
      "fechaInicioHasta": "",
      "fechaVencInicio": "",
      "fechaVencHasta": "",
      "empresa": "",
      "estado": "",
      "asesor": user.id
    }

    // Lógica para obtener clientes
    this.resumenService.obtenerClientes(params).subscribe(response => {
      console.log('response', response);
      this.dataSource.data = response; 

      // Reinicia totales antes de calcular
      this.totalsoles = 0;
      this.totaldolares = 0;
      this.totalClientes1 = 0;
      this.totalClientes2 = 0;

      // Calcula totales
      this.dataSource.data.forEach(item => {
        this.totalsoles += parseFloat(item.total_monto_soles);
        this.totaldolares += parseFloat(item.total_monto_dolares);
        if (item.empresa === "3420wm") {
          this.totalClientes1++;
        } else if (item.empresa === "F. Capital") {
          this.totalClientes2++;
        }
      });

      // Actualiza la paginación
      this.dataSource.paginator = this.paginator; 
      this.updateTableData(); 
    });
  }

  updateTableData() {
    this.dataSource.paginator?.firstPage(); // Regresa a la primera página si es necesario
  }

  exportExcel(){
    this.resumenService.exportarExcel().subscribe(response => {
      console.log('response', response);
      this.exportService.exportDataToExcel(response);
    });
  }

  aplicarFiltros(fechaInicioDesde: string, fechaInicioHasta: string, fechaVencimientoDesde: string, fechaVencimientoHasta: string, moneda: string, empresa: string, estado: string): void {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    console.log(user.id);

    const params = {
      "fechaInicioDesde": fechaInicioDesde ? fechaInicioDesde : "",
      "fechaInicioHasta": fechaInicioHasta ? fechaInicioHasta : "",
      "fechaVencInicio": fechaVencimientoDesde ? fechaVencimientoDesde : "",
      "fechaVencHasta": fechaVencimientoHasta ? fechaVencimientoHasta : "",
      "empresa": empresa ? empresa : "",
      "estado": estado ? estado : "",
      "asesor": user.id
    }

    console.log('Filtros aplicados:', params);

    this.resumenService.obtenerClientes(params).subscribe(response => {
      console.log('response', response);
      this.dataSource.data = response; 
      this.sidenav.close();
    });
    // Aquí puedes llamar a tu servicio para aplicar los filtros

}

  toggleSidenav() {
    this.sidenav.toggle();
  }

  onPageChange(event: any) {
    console.log('Página cambiada:', event.pageIndex, 'Tamaño de página:', event.pageSize);
  }

  isCurrentDateInRange(fechaInicio: string, fechaFin: string): boolean {
    const today = new Date();
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    
    return today >= startDate && today <= endDate;
  }

  goToDetail(row: any) {
    console.log(row);
    localStorage.setItem('cliente', JSON.stringify(row));
    this.router.navigate(['dashboard/detalle']);

  }

  isNearExpiration(fechaVencimiento: string): boolean {
    const fechaVencimientoDate = new Date(fechaVencimiento);
    const diffTime = fechaVencimientoDate.getTime() - this.hoy.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24); // Convertir milisegundos a días

    return diffDays <= 60 && diffDays >= 0; // Verifica si está entre 0 y 60 días
  }
}

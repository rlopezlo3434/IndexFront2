import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import { AnalisisService } from './analisis.service';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements OnInit {

  // Usamos ViewChild para obtener las referencias de los elementos
  @ViewChild('fechaInicioInput') fechaInicioInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fechaFinInput') fechaFinInput!: ElementRef<HTMLInputElement>;


  title = 'ng2-charts-demo';

  currentYear: number = new Date().getFullYear(); // Año actual
  years2: number[] = [];

  years: number[] = [];
  selectedYear: number = 0;
  nuevoCliente: any;
  porVencer: any;
  vencidos: any;
  siguienteMes: string = '';
  rangoMeses = '';

  // Opciones comunes para ambos gráficos
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };

  // Etiquetas para ambos gráficos (Soles y Dólares)
  public pieChartLabels = ['Soles', 'Dólares'];

  // Datos iniciales para los gráficos, estos se actualizarán en `ngOnInit`
  public pieChartDatasetsEmpresa1 = [
    {
      data: [0, 0],
      backgroundColor: ['#ff9f40', '#ff6384'], // Colores para Empresa 1
    }
  ];
  public pieChartDatasetsEmpresa2 = [
    {
      data: [0, 0],
      backgroundColor: ['#ff9f40', '#ff6384'], // Colores para Empresa 2
    }
  ];

  // Tipo de gráfico
  public pieChartType: ChartType = 'pie';

  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private analisisService: AnalisisService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.obtenerDatosEmpresas();
    this.generateYears();
    this.obtenerPorVencer();
    this.calcularSiguienteMes();
   
  }


  calcularSiguienteMes(): void {
    const fechaActual = new Date();
    // Sumar un mes a la fecha actual
    const siguienteMesFecha = new Date(fechaActual.setMonth(fechaActual.getMonth() + 1));

    const mes = siguienteMesFecha.toLocaleString('default', { month: 'long' });
    // Obtener el nombre del mes
    this.siguienteMes = mes.charAt(0).toUpperCase() + mes.slice(1);
  }


  onFechaChange(fechaInicio: string, fechaFin: string) {

    this.calcularMesesEnRango(fechaInicio, fechaFin)
    this.obtenerVencidos(fechaInicio, fechaFin);
    if (!fechaInicio || !fechaFin) {
      return;
    }

    console.log('Fecha Inicio:', fechaInicio);
    console.log('Fecha Fin:', fechaFin);

    // Convertir las fechas a objetos Date
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Guardar los meses en un array
    const meses: string[] = [];

    // Iterar desde la fecha de inicio hasta la fecha de fin
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Obtener el nombre del mes
      const monthName = currentDate.toLocaleString('default', { month: 'long' });
      // Convertir la primera letra a mayúscula
      const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      // Agregar el mes al array si no está ya presente
      if (!meses.includes(formattedMonthName)) {
        meses.push(formattedMonthName);
      }

      // Sumar un mes
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    console.log('Meses en el rango:', meses);

    const params = { fechaInicio: fechaInicio, fechaFin: fechaFin };
    this.analisisService.obtenerNuevoCliente(params).subscribe(
      (response: any) => {
        console.log('response', response.cantidad);
        this.nuevoCliente = response.cantidad;
      },
      (error: any) => {
        console.error('Error al obtener los datos de las empresas:', error);
      }
    );
  }

  calcularMesesEnRango(fechaInicio: string, fechaFin: string): void {
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Obtener el primer mes
    const primerMes = startDate.toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + startDate.toLocaleString('default', { month: 'long' }).slice(1);

    // Obtener el último mes
    const ultimoMes = endDate.toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + endDate.toLocaleString('default', { month: 'long' }).slice(1);

    // Formatear el resultado en el formato "Julio - Octubre"
    this.rangoMeses = `${primerMes} - ${ultimoMes}`;
  }

  obtenerPorVencer() {
    this.analisisService.obtenerPorVencer().subscribe(
      (response: any) => {
        console.log('response', response.cantidad_inversiones_por_vencer);
        this.porVencer = response.cantidad_inversiones_por_vencer;
      },
      (error: any) => {
        console.error('Error al obtener los datos de las empresas:', error);
      }
    );
  }

  obtenerVencidos(fechaInicio: string, fechaFin: string) {
    const params = { fechaInicio: fechaInicio, fechaFin: fechaFin };
    this.analisisService.obtenerVencidos(params).subscribe(
      (response: any) => {
        console.log('response', response.cantidad_inversiones_vencidas);
        this.vencidos = response.cantidad_inversiones_vencidas;
      },
      (error: any) => {
        console.error('Error al obtener los datos de las empresas:', error);
      }
    );
  }



  obtenerDatosEmpresas() {
    this.analisisService.obtenerDatosEmpresa().subscribe(
      (response: any) => {
        console.log('response', response);

        // Verifica que `response` tenga los datos esperados de las empresas
        if (response && response.length >= 2) {
          const empresa1 = response[0];
          const empresa2 = response[1];

          // Actualiza los datos de los gráficos para cada empresa
          this.pieChartDatasetsEmpresa1 = [
            {
              data: [parseFloat(empresa1.total_monto_soles), parseFloat(empresa1.total_monto_dolares)],
              backgroundColor: ['#ff9f40', '#ff6384'], // Colores personalizados para Empresa 1
            }
          ];
          this.pieChartDatasetsEmpresa2 = [
            {
              data: [parseFloat(empresa2.total_monto_soles), parseFloat(empresa2.total_monto_dolares)],
              backgroundColor: ['#ff9f40', '#ff6384'], // Colores personalizados para Empresa 2
            }
          ];
        }
      },
      (error: any) => {
        console.error('Error al obtener los datos de las empresas:', error);
      }
    );
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  }

  onYearChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = +selectElement.value; // Convertir a número
    console.log('Año seleccionado:', this.selectedYear);
  }
}

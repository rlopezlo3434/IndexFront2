import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cliente: any = {};
  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
    this.obtenerDetalleUsuario();
  }
  click(){
    this.router.navigate(['dashboard/reporte']);
  }

  obtenerDetalleUsuario() {
    const clienteData = localStorage.getItem('userData');
    this.cliente = clienteData ? JSON.parse(clienteData) : null;
    console.log(this.cliente);  
    console.log(this.cliente.user_id);
  }

  gotoLogin(){
    this.router.navigate(['login']);
    localStorage.removeItem('userData');
    localStorage.removeItem('cliente');
  }
}

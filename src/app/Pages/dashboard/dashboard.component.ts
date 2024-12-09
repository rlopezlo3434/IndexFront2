import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cliente: any = {};
  role: string = '';
  constructor(private router: Router, private toastr: ToastrService) {
    
  }

  ngOnInit(): void {

    this.obtenerDetalleUsuario();
    this.showSuccess();
  }
  click(){
    this.router.navigate(['dashboard/reporte']);
  }

  showSuccess() {
    this.toastr.success('Bienvenido!', 'Index!');
  }

  obtenerDetalleUsuario() {
    const clienteData = localStorage.getItem('userData');
    this.cliente = clienteData ? JSON.parse(clienteData) : null;
    this.role = this.cliente.rol_id;
    console.log(this.cliente);  
    console.log(this.cliente.user_id);
  }

  gotoLogin(){
    this.router.navigate(['login']);
    localStorage.removeItem('userData');
    localStorage.removeItem('cliente');
  }
}

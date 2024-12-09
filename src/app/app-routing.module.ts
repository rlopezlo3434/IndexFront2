import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/guards/auth.guard';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { ResumenComponent } from './Pages/resumen/resumen.component';
import { DetalleUsuarioComponent } from './Pages/detalle-usuario/detalle-usuario.component';
import { AnalisisComponent } from './Pages/analisis/analisis.component';
import { AsesoresComponent } from './Pages/asesores/asesores.component';
import { EmpresaComponent } from './Pages/empresa/empresa.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'reporte', component: ReporteComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'resumen', component: ResumenComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'detalle', component: DetalleUsuarioComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'analisis', component: AnalisisComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'asesores', component: AsesoresComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'empresa', component: EmpresaComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'cliente', component: ClienteComponent, pathMatch: 'full', canActivate: [AuthGuard] }


    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

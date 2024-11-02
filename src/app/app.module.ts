import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { FormsModule } from '@angular/forms'; 
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './Pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { ResumenComponent } from './Pages/resumen/resumen.component';
import { FormsModule } from '@angular/forms'
import { MatTableModule } from '@angular/material/table'; 
import {MatPaginatorModule} from '@angular/material/paginator';
import { DetalleUsuarioComponent } from './Pages/detalle-usuario/detalle-usuario.component';
import { AnalisisComponent } from './Pages/analisis/analisis.component';
import { BaseChartDirective } from 'ng2-charts';
import { AsesoresComponent } from './Pages/asesores/asesores.component';
import { provideToastr } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ReporteComponent,
    ResumenComponent,
    DetalleUsuarioComponent,
    AnalisisComponent,
    AsesoresComponent
  ],
  imports: [
    // FormsModule,
    BaseChartDirective,
    MatPaginatorModule,
    BrowserModule,
    MatTableModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    ToastrModule.forRoot(),
  ],
  providers: [provideToastr()],
  bootstrap: [AppComponent]
})
export class AppModule { }

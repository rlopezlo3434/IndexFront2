import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { clippingParents } from '@popperjs/core';
import { ReporteService } from './reporte.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  isDisabledSoles: boolean = false;
  isDisabledDolares: boolean = false;

  clienteForm!: FormGroup;
  isDisabled: boolean = false;

  montoSoles: number | null = null;
  montoDolares: number | null = null;

  mostrarBoton: boolean = false;

  clientes: any[] = []; // Aquí se guardarán todos los clientes obtenidos
  clientesFiltrados: any[] = []; // Aquí los clientes filtrados
  searchText: string = ''; // Para vincular el input de búsqueda
  clienteSeleccionado: any = null; // Para guardar el cliente seleccionado

  selectedFile: any = null;

  constructor(private reportService: ReporteService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    // Inicializa el formulario
    this.clienteForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      dni: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      fecha_nacimiento: new FormControl('', Validators.required),
      estado: new FormControl({ value: 'Vigente', disabled: true }, Validators.required),
      tipoInversion: new FormControl('', Validators.required),
      fecha_inicio: new FormControl('', Validators.required),
      fecha_vencimiento: new FormControl('', Validators.required),
      perfilInversion: new FormControl('', Validators.required),
      empresa: new FormControl('', Validators.required),
      monto_soles: new FormControl({ value: 0.0, disabled: false }, Validators.required),
      monto_dolares: new FormControl({ value: 0.0, disabled: false }, Validators.required),
      fondo: new FormControl('', Validators.required),
      rentabilidad: new FormControl('', Validators.required),
      objetivo: new FormControl('', Validators.required),
      frecuencia: new FormControl('', Validators.required),
      nombre2: new FormControl({ value: '', disabled: true }, Validators.required),
      apellido2: new FormControl({ value: '', disabled: true }, Validators.required),
      dni2: new FormControl({ value: '', disabled: true }, Validators.required),
      phone2: new FormControl({ value: '', disabled: true }, Validators.required),
      email2: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      fecha_nacimiento2: new FormControl({ value: '', disabled: true }, Validators.required),
      nombre3: new FormControl({ value: '', disabled: true }, Validators.required),
      apellido3: new FormControl({ value: '', disabled: true }, Validators.required),
      dni3: new FormControl({ value: '', disabled: true }, Validators.required),
      phone3: new FormControl({ value: '', disabled: true }, Validators.required),
      email3: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      fecha_nacimiento3: new FormControl({ value: '', disabled: true }, Validators.required),
    });

    this.obtenerClientes();
    this.obtenerReporte();
  }


  obtenerValores(): void {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    console.log(user.id);
    const formData = this.clienteForm.getRawValue();

    const resultado = {
      ...formData,
      password: "123456789",
      rol_id: 3,
      asesor: user.id,
      user_id: "",
      documento: this.selectedFile?.contenido, // Enviamos el contenido en base64
      nombre_documento: this.selectedFile?.nombre,
      tipo_documento: this.selectedFile?.tipo
    };

    console.log(resultado);

    if (resultado) {
      this.reportService.registrarCliente(resultado).subscribe({
        next: (response: any) => {
          console.log('registrado', response);
          this.toastr.success('Registro de Cliente e Inversión Exitoso!', 'Index!');
          this.clienteForm.reset();
        },
        error: (error) => {
          console.error('Login failed', error);
          this.toastr.error('Error en el registro del Cliente e Inversión!', 'Index!');
        }
      });
    }
  }

  obtenerClientes(): void {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    console.log(user.id);

    this.reportService.obtenerClientes(user.id).subscribe({
      next: (response: any) => {
        this.clientes = response;
        console.log('clientes', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  obtenerReporte(): void {
    this.reportService.obtenerReporte().subscribe({
      next: (response: any) => {
        console.log('reporte', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  filtrarClientes(event: Event): void {
    const input = event.target as HTMLInputElement; // Obtener el elemento de entrada
    this.searchText = input.value.trim().toLowerCase(); // Obtener el valor del input

    if (this.searchText === '') {
      this.clientesFiltrados = [...this.clientes]; // Si no hay texto, muestra todos los clientes
    } else {
      console.log(this.searchText); // Para verificar el valor del input
      this.clientesFiltrados = this.clientes.filter(cliente => {
        const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
        return nombreCompleto.includes(this.searchText);
      });
    }

    // Reset clienteSeleccionado cuando se filtran los clientes
    this.clienteSeleccionado = null;
  }

  seleccionarCliente(cliente: any): void {
    this.clienteSeleccionado = cliente;
    this.clientesFiltrados = []; // Limpiar la lista filtrada
    this.searchText = ''; // Limpiar el input de búsqueda
    this.mostrarBoton = true;
    console.log('Cliente seleccionado:', cliente);

    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      dni: cliente.dni,
      email: cliente.email,
      phone: cliente.phone,
      fecha_nacimiento: cliente.fecha_nacimiento,
    });
    // Aquí puedes realizar más acciones como cargar información del cliente
  }


  nuevaInversion(): void {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    console.log(user.id);
    const formData = this.clienteForm.getRawValue();
    const resultado = {
      ...formData,
      asesor: user.id,
      user_id: "",
    };

    const valoresAEnviar = {
      estado: this.clienteForm.get('estado')?.value,
      tipoInversion: this.clienteForm.get('tipoInversion')?.value,
      fecha_inicio: this.clienteForm.get('fecha_inicio')?.value,
      fecha_vencimiento: this.clienteForm.get('fecha_vencimiento')?.value,
      perfilInversion: this.clienteForm.get('perfilInversion')?.value,
      empresa: this.clienteForm.get('empresa')?.value,
      monto_soles: this.clienteForm.get('monto_soles')?.value,
      monto_dolares: this.clienteForm.get('monto_dolares')?.value,
      fondo: this.clienteForm.get('fondo')?.value,
      rentabilidad: this.clienteForm.get('rentabilidad')?.value,
      objetivo: this.clienteForm.get('objetivo')?.value,
      frecuencia: this.clienteForm.get('frecuencia')?.value,
      nombre2: this.clienteForm.get('nombre2')?.value,
      apellido2: this.clienteForm.get('apellido2')?.value,
      dni2: this.clienteForm.get('dni2')?.value,
      phone2: this.clienteForm.get('phone2')?.value,
      email2: this.clienteForm.get('email2')?.value,
      fecha_nacimiento2: this.clienteForm.get('fecha_nacimiento2')?.value,
      nombre3: this.clienteForm.get('nombre3')?.value,
      apellido3: this.clienteForm.get('apellido3')?.value,
      dni3: this.clienteForm.get('dni3')?.value,
      phone3: this.clienteForm.get('phone3')?.value,
      email3: this.clienteForm.get('email3')?.value,
      fecha_nacimiento3: this.clienteForm.get('fecha_nacimiento3')?.value,
      user_id: this.clienteSeleccionado.id,
      documento: this.selectedFile?.contenido, // Enviamos el contenido en base64
      nombre_documento: this.selectedFile?.nombre,
      tipo_documento: this.selectedFile?.tipo
    };
    console.log(valoresAEnviar);


    if (resultado) {
      this.reportService.registrarInversion(valoresAEnviar).subscribe({
        next: (response: any) => {
          console.log('inversion registrada', response);
          this.clienteForm.reset();
          this.clienteSeleccionado = null;
          this.mostrarBoton = false;
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }

  onBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      const inputValue = target.value;  // Ahora puedes acceder a 'value'
      console.log('Valor del input:', inputValue);
    }
  }

  toggleDisabled(event: any): void {
    const value = !event.target.checked;
    console.log(value);
    if (value) {
      this.clienteForm.get('nombre2')?.disable();
      this.clienteForm.get('apellido2')?.disable();
      this.clienteForm.get('dni2')?.disable();
      this.clienteForm.get('phone2')?.disable();
      this.clienteForm.get('email2')?.disable();
      this.clienteForm.get('fecha_nacimiento2')?.disable();
      this.clienteForm.get('nombre3')?.disable();
      this.clienteForm.get('apellido3')?.disable();
      this.clienteForm.get('dni3')?.disable();
      this.clienteForm.get('phone3')?.disable();
      this.clienteForm.get('email3')?.disable();
      this.clienteForm.get('fecha_nacimiento3')?.disable();
    } else {
      this.clienteForm.get('nombre2')?.enable();
      this.clienteForm.get('apellido2')?.enable();
      this.clienteForm.get('dni2')?.enable();
      this.clienteForm.get('phone2')?.enable();
      this.clienteForm.get('email2')?.enable();
      this.clienteForm.get('fecha_nacimiento2')?.enable();
      this.clienteForm.get('nombre3')?.enable();
      this.clienteForm.get('apellido3')?.enable();
      this.clienteForm.get('dni3')?.enable();
      this.clienteForm.get('phone3')?.enable();
      this.clienteForm.get('email3')?.enable();
      this.clienteForm.get('fecha_nacimiento3')?.enable();
    }
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);
    if (value > 0) {
      this.clienteForm.get('monto_dolares')?.disable();
    }
    else if (value === 0) {
      this.clienteForm.get('monto_dolares')?.enable();
    }
    if (isNaN(value)) {
      console.log("entro")
      this.clienteForm.get('monto_dolares')?.enable();

    }
  }

  onInputChange2(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);
    if (value >= 0) {
      this.isDisabledSoles = true;
      this.clienteForm.get('monto_soles')?.disable();
    }
    else if (value === 0) {
      this.clienteForm.get('monto_dolares')?.enable();
    }
    if (isNaN(value)) {
      console.log("entro")
      this.clienteForm.get('monto_soles')?.enable();

    }
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

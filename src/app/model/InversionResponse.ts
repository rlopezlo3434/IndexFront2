export interface InversionData {
    estado: any;
    tipoInversion: any;
    fecha_inicio: any;
    fecha_vencimiento: any;
    perfilInversion: any;
    empresa: any;
    monto_soles: any;
    monto_dolares: any;
    fondo: any;
    rentabilidad: any;
    objetivo: any;
    frecuencia: any;
    nombre2: any;
    apellido2: any;
    dni2: any;
    phone2: any;
    email2: any;
    fecha_nacimiento2: any;
    nombre3: any;
    apellido3: any;
    dni3: any;
    phone3: any;
    email3: any;
    fecha_nacimiento3: any;
    user_id: number;
    documento: File | null; // Asumiendo que puede ser null si no se selecciona un archivo
    nombre_documento: string;
}
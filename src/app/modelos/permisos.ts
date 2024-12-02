export interface Permisos {
  id?: number;
  user_id: number | null | undefined;
  cedula:number;
  name :string | null | undefined;
  user: any;
 
  p_venta: string;
  categoria_solicitud: string;
  tiempo_requerido: number;
  unidad_tiempo: string;
  hora: string;
  fecha_permiso: Date;
  fecha_solicitud: Date;
  estado: string;
  justificacion: string;
}

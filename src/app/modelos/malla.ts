export interface Malla {
  id?: number;
  user_id: number | null | undefined;
  cedula:number;
  name :string | null | undefined;
  user: any;
 
  proceso: string;        // Tipo de proceso, por ejemplo: 'Administrador de Tienda'
  p_venta: string;  
  estado: string;
  calificacion: number;      // El código de 'p_venta', como '01 - COMERCIO'


}

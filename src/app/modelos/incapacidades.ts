export interface IncapacidadesImage
{
    image_path:string;
}

export interface Incapacidades {
    id?: number;
    user_id :number | null | undefined;
    cedula:number;
    name :string | null | undefined;
    user: any;
    uuid?: string| null | undefined;
    tipo_incapacidad_reportada ?: string | null | undefined; 
    dias_incapacidad : number | null | undefined;
    fecha_inicio_incapacidad: Date;
    aplica_cobro : boolean | null | undefined
    identificador_incapacidad: string | null | undefined;
    entidad_afiliada ?:string | null | undefined;
    categoria_id: number;  
    tipo_incapacidad ?:string | null | undefined; 
    images?: IncapacidadesImage[]; 
    


}

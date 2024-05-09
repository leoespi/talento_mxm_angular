export class Incapacidades {
    id?: number;
    user_id :number | null | undefined;
    cedula:number;
    name :string | null | undefined;
    user: any;
    dias_incapacidad : number | null | undefined;
    fecha_inicio_incapacidad: Date;
    aplica_cobro : boolean | null | undefined
    entidad_afiliada ?:string | null | undefined; 
    tipo_incapacidad ?:string | null | undefined; 
    image ?:string | null | undefined;
    uuid?: string| null | undefined; // Agregar el atributo uuid
    


        constructor(id: number, user_id:number,cedula: number, name:string, dias_incapacidad: number, fecha_inicio_incapacidad: Date, aplica_cobro: boolean, entidad_afiliada:string , tipo_incapacidad:string, user_cedula:number, image:string, uuid: string) {
            this.id = id;
            this.user_id = user_id;
            this.cedula = user_cedula;
            this.name = name;
            this.dias_incapacidad = dias_incapacidad;
            this.fecha_inicio_incapacidad= fecha_inicio_incapacidad;
            this.aplica_cobro = aplica_cobro;
            this.entidad_afiliada = entidad_afiliada;
            this.tipo_incapacidad = tipo_incapacidad;
            this.image = image;  
            this.uuid = uuid; 
        }
}

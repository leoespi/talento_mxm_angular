export class Cesantiasautorizadas {
    id?: number;
    user_id :number | null | undefined;
    cedula:number;
    name :string | null | undefined;
    user: any;

    tipo_cesantia_reportada ?: string | null | undefined;
    estado ?: string | null | undefined;
    image ?:string | null | undefined;
    uuid?: string| null | undefined;// Agregar el atributo uuid

    
    constructor(id: number, user_id:number ,estado:string,cedula: number, name:string, tipo_cesantia_reportada:string, image:string, uuid: string) {
        this.id = id;
        this.user_id = user_id;
        this.cedula = cedula;
        this.name = name;
        this.tipo_cesantia_reportada = tipo_cesantia_reportada;
        this.estado = estado;
        this.image = image;  
        this.uuid = uuid; 
    }
}

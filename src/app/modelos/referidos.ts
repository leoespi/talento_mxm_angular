export class Referidos {
    id?: number;
    user_id :number | null | undefined;
    cedula:number;
    name :string | null | undefined;
    user: any;

    tipo_cargo ?: string | null | undefined;
    //estado ?: string | null | undefined;
    documento ?:string | null | undefined;
     

    
    constructor(id: number, user_id:number ,estado:string,cedula: number, name:string, tipo_cargo:string, image:string, uuid: string) {
        this.id = id;
        this.user_id = user_id;
        this.cedula = cedula;
        this.name = name;
        this.tipo_cargo = tipo_cargo;
        //this.estado = estado;
        this.documento = this.documento;  
        //this.uuid = uuid; 
    }
}

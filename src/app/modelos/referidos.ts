export class Referidos {
    id?: number;
    user_id :number | null | undefined;
    cedula:number;
    name :string | null | undefined;
    user: any;

    estado ?: string | null | undefined;
    //estado ?: string | null | undefined;
    documento ?:string | null | undefined;
     

    
    constructor(id: number, user_id:number ,estado:string,cedula: number, name:string, tipo_cargo:string, image:string, uuid: string) {
        this.id = id;
        this.user_id = user_id;
        this.cedula = cedula;
        this.name = name;
        this.estado = estado;
        //this.estado = estado;
        this.documento = this.documento;  
        //this.uuid = uuid; 
    }
}

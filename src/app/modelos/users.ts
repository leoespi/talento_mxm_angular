export class Users {

    id?: number;
    name :string | null | undefined;
    cedula:number;
    email :string | null | undefined;
    rol_id?: number;
    is_active?: boolean;
    
   constructor(id : number, name:string, email:string, cedula:number, rol_id:number, is_active:boolean ){
    this.id = id;
    this.name = name;
    this.cedula = cedula;
    this.email = email;
    this.rol_id = rol_id;
    this.is_active = is_active;
   }
}

export class Users {

    id?: number;
    nombre? :string | null | undefined;
    cedula:number;
    email :string | null | undefined;
    rol_id?: number;
    
   constructor(id : number, name:string, email:string, cedula:number, rol_id:number){
    this.id = id;
    this.nombre = name;
    this.cedula = cedula;
    this.email = email;
    this.rol_id = rol_id;

   }
}

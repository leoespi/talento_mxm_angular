export class Horarios {
    id: number;
    cedula: number;
    lunes: string | null;
    martes: string | null;
    miercoles: string | null;
    jueves: string | null;
    viernes: string | null;
    sabado: string | null;
    domingo: string | null;
    lunes2: string | null;
    martes2: string | null;
    miercoles2: string | null;
    jueves2: string | null;
    viernes2: string | null;
    sabado2: string | null;
    domingo2: string | null;

    constructor( id:number, cedula:number, lunes: string,  martes: string,  miercoles: string , jueves: string, viernes: string ,sabado: string, domingo: string , 
        lunes2: string,  martes2: string,  miercoles2: string , jueves2: string, viernes2: string ,sabado2: string, domingo2: string 
     ){


            this.id = id;
            this.cedula = cedula;
            this.lunes = lunes;
            this.martes = martes;
            this.miercoles = miercoles;
            this.jueves = jueves;
            this.viernes = viernes;
            this.sabado = sabado;
            this.domingo = domingo;
            this.lunes2 = lunes2;
            this.martes2 = martes2;
            this.miercoles2 = miercoles2;
            this.jueves2 = jueves2;
            this.viernes2 = viernes2;
            this.sabado2 = sabado2;
            this.domingo2 = domingo2;




    }
}

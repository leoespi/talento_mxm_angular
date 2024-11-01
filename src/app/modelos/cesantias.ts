export interface CesantiasImage
{
    image_path:string;
}


export interface Cesantias {
    id?: number;
    user_id :number | null | undefined;
    cedula:number;
    name :string | null | undefined;
    user: any;

    tipo_cesantia_reportada ?: string | null | undefined;
    estado ?: string | null | undefined;
    images?: CesantiasImage[]; 

    uuid?: string| null | undefined;// Agregar el atributo uuid
    createdAt?: string | null | undefined; // Agregar la fecha de creación


}






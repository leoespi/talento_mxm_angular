import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Cesantias } from '../modelos/cesantias';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CesantiasService {

  
   // URL base de la API para las incapacidades
   url='http://127.0.0.1:8000/api/cesantias/';

 
   // URL de la API para obtener usuarios
   usersUrl = 'http://127.0.0.1:8000/api/users';
 
 
   // URL de la API para exportar incapacidades
   urlExport='http://127.0.0.1:8000/api/';

   
 
 
   constructor(private http:HttpClient) {}

 
 
     // Método para obtener un usuario por su ID
    getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
     const headers = new HttpHeaders({
       'Authorization': 'Bearer ' + access_token
     });
     const options = { headers: headers };
     return this.http.get<any>(`${this.usersUrl}/${userId}`, options);
   }

    // Método para exportar cesantías en formato Excel
  exportCesantias(year: number | null): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('clave') // Asegúrate de tener el token en el almacenamiento local
    });

    const options = {
      headers: headers,
      responseType: 'blob' as 'json' // Indicamos que esperamos una respuesta de tipo Blob
    };

    // Construimos la URL para exportar las cesantías por año
    const exportUrl = `${this.urlExport}export-cesantias/${year}`;

    return this.http.get<Blob>(exportUrl, options);
  }

   
   getCesantias(access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.get(this.url, options);
  }

  authorizeCesantia(id: number | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };

    // Asegúrate de que id no sea undefined antes de hacer la solicitud
    if (id === undefined) {
      throw new Error('ID de cesantía no definido');
    }

    return this.http.put(`${this.url}${id}/authorize`, {}, options);
  } 


  
  denyCesantiaAdmin(id: number, access_token: string, justificacion: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
  
    const body = { justificacion: justificacion };
  
    return this.http.post(`${this.url}deny/${id}`, body, options);
  }
  

  
    // Método para agregar una nueva incapacidad médica
  addCesantias(cesantias: Cesantias, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.post(this.url, cesantias, options);
  }

  // Método para actualizar una incapacidad médica existente
  updateCesantias(id:string, cesantias:Cesantias, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.put(this.url +id,cesantias, options);         
  }


  
   // Método para descargar todas las incapacidades en formato de hoja de cálculo por año
 
  deleteCesantias(id:string, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.delete(this.url +id, options);
  }

  downloadImage(uuid: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.url}${uuid}/downloadFromDB`, options);
  }


  downloadZip(uuid: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.url}download-zip/${uuid}`, options);
  }
 
   // Método para obtener todos los usuarios del sistema
   getUserss(access_token:any):Observable<any>{
     const headers = new HttpHeaders({
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + access_token
     });
     const options = { headers: headers};
     return this.http.get(this.url, options);
   }

}

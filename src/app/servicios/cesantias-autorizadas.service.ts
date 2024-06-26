import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Cesantiasautorizadas } from '../modelos/cesantiasautorizadas';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CesantiasAutorizadasService {

   
   // URL base de la API para las incapacidades
   url='http://127.0.0.1:8000/api/';

   urldenyadmin='http://127.0.0.1:8000/api/cesantias/';

 
   // URL de la API para obtener usuarios
   usersUrl = 'http://127.0.0.1:8000/api/users';
 
 
   // URL de la API para exportar incapacidades
   urlExport='http://127.0.0.1:8000/api/export-cesantias';

   
 
 
   constructor(private http:HttpClient) {}

 
 
     // Método para obtener un usuario por su ID
    getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
     const headers = new HttpHeaders({
       'Authorization': 'Bearer ' + access_token
     });
     const options = { headers: headers };
     return this.http.get<any>(`${this.usersUrl}/${userId}`, options);
   }
   
   getCesantiasAutorizadas(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get(`${this.url}authorizedCesantia`, options);
  }


  denyCesantiaAdmin(id: number | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };

    // Asegúrate de que id no sea undefined antes de hacer la solicitud
    if (id === undefined) {
      throw new Error('ID de cesantía no definido');
    }

    return this.http.put(`${this.urldenyadmin}${id}/denyadmin`, {}, options);
  } 
  

  downloadCesantiasByYear(year: number, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };

    // Construir los parámetros de la solicitud HTTP
    const params = new HttpParams().set('year', year.toString());

    return this.http.get<Blob>(`${this.url}/export-cesantias`, { ...options, params: params });
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
    return this.http.get<Blob>(`${this.url}authorizedCesantia/download-zip/${uuid}`, options);
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

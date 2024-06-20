import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CesantiasDenegadas } from '../modelos/cesantias-denegadas';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CesantiasDenegadasService {

 // URL base de la API para las incapacidades
 url='http://127.0.0.1:8000/api/';

 
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
 
 getCesantiasDenegadas(access_token: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  });
  const options = { headers: headers };
  return this.http.get(`${this.url}denyCesantia`, options);
}


denyCesantia(id: number | undefined, access_token: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  });
  const options = { headers: headers };

  // Asegúrate de que id no sea undefined antes de hacer la solicitud
  if (id === undefined) {
    throw new Error('ID de cesantía no definido');
  }

  return this.http.put(`${this.url}${id}/deny`, {}, options);
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

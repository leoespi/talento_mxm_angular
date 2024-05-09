import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Incapacidades } from '../modelos/incapacidades';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class IncapacidadesService {

  url='http://127.0.0.1:8000/api/incapacidades';

 
  
  usersUrl = 'http://127.0.0.1:8000/api/users';

  urlExport='http://127.0.0.1:8000/api/export-incapacidades';


  constructor(private http:HttpClient) {

   }


   getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get<any>(`${this.usersUrl}/${userId}`, options);
  }
   


  visualizarImagen(uuid: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.url}/${uuid}/downloadFromDB`, options);
  }
  


   downloadImage(uuid: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.url}/${uuid}/downloadFromDB`, options);
  }

   
   downloadIncapacidades(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' }; // Aquí cambiamos el tipo de respuesta a "blob"
    return this.http.get(this.urlExport, options);
  }

   getIncapacidades(access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.get(this.url, options);
  }

  addIncapacidades(incapacidades: Incapacidades, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.post(this.url, incapacidades, options);
  }



  updateIncapacidades(id:string, incapacidades :Incapacidades, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.put(this.url +"/"+id,incapacidades, options);         
  }

  deleteIncapacidades(id:string, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.delete(this.url +"/"+id, options);
  }

  getUserss(access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.get(this.url, options);
  }

}

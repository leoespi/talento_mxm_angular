import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Incapacidades } from '../modelos/incapacidades';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class IncapacidadesService {

  url='http://127.0.0.1:8000/api/incapacidades';


  
  users = 'http://127.0.0.1:8000/api/users';

  urlExport='http://127.0.0.1:8000/api/export-incapacidades';


  constructor(private http:HttpClient) {

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

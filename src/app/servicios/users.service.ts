import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../modelos/users';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // URLs de la API
  url='http://127.0.0.1:8000/api/users';

  urldestroy= 'http://127.0.0.1:8000/api/user';

  urlExport='http://127.0.0.1:8000/api/export-users'

  constructor(private http:HttpClient){}


  // Método para descargar usuarios
  downloadUsers(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' }; 
    return this.http.get(this.urlExport, options);
  }
  

  // Método para obtener usuarios
  getUserss(access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.get("http://127.0.0.1:8000/api/users", options);
  }

  // Método para agregar usuarios
  addUsers(users : Users, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.post(this.url,users, options);
  }

  // Método para actualizar usuarios
  updateUsers(id:string, users:Users, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.put(this.url+"/"+id,users, options);         
  }

  // Método para eliminar usuarios
  deleteUsers(id:string, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.delete(this.urldestroy+"/"+id, options);
  }

   // Método para activar usuarios
   activateUser(id: string, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.post(`http://127.0.0.1:8000/api/users/${id}/activate`, {}, options);
  }

  // Método para desactivar usuarios
  deactivateUser(id: string, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.post(`http://127.0.0.1:8000/api/users/${id}/deactivate`, {}, options);
  }
}
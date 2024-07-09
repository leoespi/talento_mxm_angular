import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Referidos }  from '../modelos/referidos';


@Injectable({
  providedIn: 'root'
})
export class ReferidosService {
  private apiUrl = 'http://127.0.0.1:8000/api/referidos/';

  
   // URL de la API para obtener usuarios
   usersUrl = 'http://127.0.0.1:8000/api/users';
 

  constructor(private http: HttpClient) { }

   // Método para obtener un usuario por su ID
   getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get<any>(`${this.usersUrl}/${userId}`, options);
  }


  getReferidos(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' 
    });
    const options = { headers: headers};
    return this.http.get(this.apiUrl, options);
  }

  downloadDocumento(id: number, ): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.apiUrl}download/${id}`, options);
  }

  deleteReferido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { horarios } from '../modelos/horarios';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private apiUrl = 'http://127.0.0.1:8000/horarios'; // Cambia esto a la URL de tu API

// URL de la API para obtener usuarios
 private  usersUrl = 'http://127.0.0.1:8000/api/users';


  constructor(private http: HttpClient) {}

  
    // Método para obtener todas las incapacidades médicas LISTAR LOS DATOS
    getHorarios(access_token:any):Observable<any>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      });
      const options = { headers: headers};
      return this.http.get(this.apiUrl, options);
    }
  
     // Método para obtener un usuario por su ID
   getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get<any>(`${this.usersUrl}/${userId}`, options);
  }
   


}

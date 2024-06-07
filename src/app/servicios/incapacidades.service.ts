import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Incapacidades } from '../modelos/incapacidades';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class IncapacidadesService {

   // URL base de la API para las incapacidades
  url='http://127.0.0.1:8000/api/incapacidades/';

 
  // URL de la API para obtener usuarios
  usersUrl = 'http://127.0.0.1:8000/api/users';


  // URL de la API para exportar incapacidades
  urlExport='http://127.0.0.1:8000/api/export-incapacidades';


  constructor(private http:HttpClient) {

   }


    // Método para obtener un usuario por su ID
   getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get<any>(`${this.usersUrl}/${userId}`, options);
  }
   


 

   // Método para descargar todas las incapacidades en formato de hoja de cálculo por año
  downloadIncapacidadesByYear(year: string, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' }; // Cambia el tipo de respuesta a "blob"
    return this.http.get(`${this.urlExport}?year=${year}`, options); // Agrega el año a la URL
  }


     // Método para obtener todas las incapacidades médicas LISTAR LOS DATOS
   getIncapacidades(access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.get(this.url, options);
  }

  // Método para agregar una nueva incapacidad médica
  addIncapacidades(incapacidades: Incapacidades, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.post(this.url, incapacidades, options);
  }


  // Método para actualizar una incapacidad médica existente
  updateIncapacidades(id:string, incapacidades:Incapacidades, access_token:any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers};
    return this.http.put(this.url +id,incapacidades, options);         
  }

  // Método para eliminar una incapacidad médica
  deleteIncapacidades(id:string, access_token:any):Observable<any>{
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

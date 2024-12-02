import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Malla } from '../modelos/malla'; 
 // Importar el modelo Malla
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MallaService {

  private apiUrl = 'http://127.0.0.1:8000/api/malla';  // URL del API para obtener las mallas

  constructor(private http: HttpClient) { }

  // Obtener todas las mallas
  getMallas(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get(this.apiUrl, options)
  }

  exportMallas(access_token: any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token 

    });
    const options = {headers: headers, responseType: 'blob' as 'json'};
    return this.http.get(this.apiUrl+'-exportar',options);
  }


  
  downloadDocumento(id: number, access_token: string ): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.apiUrl}-descargar/${id}`, options);
  }


  calificarmalla(id: number, calificacion: number, access_token: any): Observable<any> {
    const headers = this.createHeaders(access_token);
    const body = { calificacion: calificacion };
  
    // Realiza una solicitud POST o PUT dependiendo de tu API
    return this.http.put(`${this.apiUrl}-calificar/${id}`, body, { headers });
  }
  
  
  estadomalla(id: number, estado: number, access_token: any): Observable<any> {
    const headers = this.createHeaders(access_token);
    const body = { estado: estado };
  
    // Realiza una solicitud POST o PUT dependiendo de tu API
    return this.http.put(`${this.apiUrl}-estado/${id}`, body, { headers });
  }
  

  
  private createHeaders(access_token: any): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
  }

  

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error ${error.status}, Error: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError('Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
  }


  











}

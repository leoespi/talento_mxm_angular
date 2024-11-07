import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cesantiasautorizadas } from '../modelos/cesantiasautorizadas';

@Injectable({
  providedIn: 'root'
})
export class CesantiasAutorizadasService {

  
  //url prueba  (SOLO SE USA PARA CARGAR EL POR LA IP DEL COMPUTADOR)
  //private baseUrl = 'http://192.168.1.148:8000/api/';

  // URL base de la API
  private baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  private createHeaders(access_token: any): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
  }

  
  // Método para obtener cesantías autorizadas
  getCesantiasAutorizadas(access_token: any): Observable<any> {
    const headers = this.createHeaders(access_token);
    return this.http.get(`${this.baseUrl}authorizedCesantia`, { headers });
  }

  // Método para aprobar cesantía
  aprobarCesantia(id: number, justificacion: string, access_token: any): Observable<any> {
    const headers = this.createHeaders(access_token);
    const body = { justificacion: justificacion };
    
    return this.http.post(`${this.baseUrl}cesantias/aprobar/${id}`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para denegar cesantía administrativamente
  denyCesantiaAdmin(id: number, access_token: string, justificacion: string): Observable<any> {
    const headers = this.createHeaders(access_token);
    const body = { justificacion: justificacion };

    return this.http.post(`${this.baseUrl}cesantias/denyadmin/${id}`, body, { headers });
  }



  

  // Método para obtener todos los usuarios del sistema
  getUsers(access_token: any): Observable<any> {
    const headers = this.createHeaders(access_token);
    return this.http.get(`${this.baseUrl}users`, { headers });
  }

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

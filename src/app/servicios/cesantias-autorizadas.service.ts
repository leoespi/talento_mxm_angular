import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cesantiasautorizadas } from '../modelos/cesantiasautorizadas';

@Injectable({
  providedIn: 'root'
})
export class CesantiasAutorizadasService {

  // URL base de la API
  url = 'http://127.0.0.1:8000/api/';
  urldenyadmin = 'http://127.0.0.1:8000/api/cesantias/';
  usersUrl = 'http://127.0.0.1:8000/api/users';
  urlExport = 'http://127.0.0.1:8000/api/export-cesantias';

  constructor(private http: HttpClient) {}

  // Método para obtener un usuario por su ID
  getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get<any>(`${this.usersUrl}/${userId}`, options);
  }
   
  // Método para obtener cesantías autorizadas
  getCesantiasAutorizadas(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get(`${this.url}authorizedCesantia`, options);
  }

    // Método para aprobar cesantía
    aprobarCesantia(id: number, justificacion: string, access_token: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      });
      const options = { headers: headers };
      const body = { justificacion: justificacion };
  
      return this.http.post(`${this.url}cesantias/aprobar/${id}`, body, options).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido';
          if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // El servidor devolvió un código de estado HTTP con un error
            errorMessage = `Código de error ${error.status}, Error: ${error.error}`;
          }
          console.error(errorMessage);
          // Retornar un observable con un mensaje de error para el componente
          return throwError('Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
        })
      );
    }
  

  // Método para denegar cesantía administrativamente
  denyCesantiaAdmin(id: number, access_token: string, justificacion: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };

    const body = { justificacion: justificacion };

    

    return this.http.post(`${this.urldenyadmin}denyadmin/${id}`,body, options);
  }

  // Método para descargar cesantías por año
  downloadCesantiasByYear(year: number, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    const params = new HttpParams().set('year', year.toString());

    return this.http.get<Blob>(`${this.url}/export-cesantias`, { ...options, params: params });
  }

  // Método para eliminar cesantías
  deleteCesantias(id: string, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.delete(this.url + id, options);
  }

  // Método para descargar imagen
  downloadImage(uuid: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.url}${uuid}/downloadFromDB`, options);
  }

  // Método para descargar ZIP de cesantías autorizadas
  downloadZip(uuid: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.url}authorizedCesantia/download-zip/${uuid}`, options);
  }

  // Método para obtener todos los usuarios del sistema
  getUserss(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get(this.url, options);
  }
}

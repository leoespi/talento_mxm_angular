import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Permisos } from '../modelos/permisos';

import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {



  private apiurl = 'http://127.0.0.1:8000/api/permisos';

 
  
  constructor(private http: HttpClient) { }


  exportpermisos(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' }; 
    return this.http.get(this.apiurl+'-exportar', options);

  }
  
  
  

  getpermisos(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token // Asegúrate de tener el espacio entre 'Bearer' y el token
    });
    const options = { headers: headers };
    return this.http.get(this.apiurl, options);
  }
  

  private createHeaders(access_token: any): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
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

  updatepermisos( id:number, estado:string,  access_token:any): Observable<any>{
    const headers = this.createHeaders(access_token);
    const body = { estado: estado };
    

   
    return this.http.put<any>(`${this.apiurl}/${id}`, body,{headers}).pipe(
      catchError(this.handleError)
    );

  }



}

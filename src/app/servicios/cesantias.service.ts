import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cesantias } from '../modelos/cesantias';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CesantiasService {
  
  // URL API 
  apiurl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  // Método para obtener un usuario por su ID
  getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get<any>(`${this.apiurl}/users/${userId}`, options);
  }

  // Método para descargar documentos de incapacidad por ID
  downloadDocumentsById(id: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.apiurl}cesantias/${id}/documentos`, options);
  }

  // Método para exportar cesantías en formato Excel
  exportCesantias(year: number | null): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('clave') // Asegúrate de tener el token en el almacenamiento local
    });

    const options = {
      headers: headers,
      responseType: 'blob' as 'json' // Indicamos que esperamos una respuesta de tipo Blob
    };

    // Construimos la URL para exportar las cesantías por año
    const exportUrl = `${this.apiurl}export-cesantias/${year}`;
    return this.http.get<Blob>(exportUrl, options);
  }

  // Método para obtener todas las cesantías
  getCesantias(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get(`${this.apiurl}cesantiasall/`, options);
  }

  // Método para autorizar una cesantía
  authorizeCesantia(id: number | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };

    // Asegúrate de que id no sea undefined antes de hacer la solicitud
    if (id === undefined) {
      throw new Error('ID de cesantía no definido');
    }

    return this.http.put(`${this.apiurl}cesantias/${id}/authorize`, {}, options);
  } 

  // Método para denegar una cesantía
  denyCesantiaAdmin(id: number, access_token: string, justificacion: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    const body = { justificacion: justificacion };
    return this.http.post(`${this.apiurl}cesantias/deny/${id}`, body, options);
  }

  // Método para actualizar una incapacidad médica existente
  updateCesantias(id: string, cesantias: Cesantias, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.put(`${this.apiurl}cesantias/${id}`, cesantias, options);         
  }

  // Método para descargar un ZIP de imágenes
  downloadZip(id: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.apiurl}cesantias/${id}/download-images`, options);
  }
}

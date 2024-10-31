import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Incapacidades } from '../modelos/incapacidades';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncapacidadesService {
  private apiurl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Obtiene un usuario por su ID
  getUserById(userId: number | null | undefined, access_token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + access_token });
    const options = { headers: headers };
    return this.http.get<any>(`${this.apiurl}/users/${userId}`, options);
  }

  // Descarga incapacidades por año
  downloadIncapacidadesByYear(year: string, access_token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + access_token });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get(`${this.apiurl}/export-incapacidades/?year=${year}`, options);
  }

  // Obtiene todas las incapacidades médicas
  getIncapacidades(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get(`${this.apiurl}/incapacidadesall`, options);
  }

  // Actualiza una incapacidad médica existente
  updateIncapacidades(id: string, incapacidades: Incapacidades, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.put(`${this.apiurl}/incapacidades/${id}`, incapacidades, options);
  }

  // Elimina una incapacidad médica
  deleteIncapacidades(id: string, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.delete(`${this.apiurl}/incapacidades/${id}`, options);
  }

  // Descarga una imagen por ID
  downloadImage(id: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + access_token });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.apiurl}/incapacidades/${id}/downloadFromDB`, options);
  }

  // Descarga un ZIP de imágenes por ID
  downloadZip(id: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + access_token });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.apiurl}/incapacidades/${id}/download-images`, options);
  }

  // Descarga documentos de incapacidad por ID
  downloadDocumentsById(id: string, access_token: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + access_token });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http.get<Blob>(`${this.apiurl}/incapacidades/${id}/documentos`, options);
  }

  // Obtiene todos los usuarios del sistema
  getUserss(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.get(`${this.apiurl}/incapacidades/`, options);
  }
}

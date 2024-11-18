import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //url prueba  (SOLO SE USA PARA CARGAR EL POR LA IP DEL COMPUTADOR)
  //url = 'http://192.168.1.148:8000/api/';


  url = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión
  login(cedula: any, password: any): Observable<any> {
    return this.http.post(this.url + "login", { cedula: cedula, password: password });
  }

  // Método para cerrar sesión
  logout(cedula: string): Observable<any> {
    return this.http.post(this.url + "logout", null);
  }

  // Método para registrar un usuario administrador
  Register(name:any, cedula: any, email: any, p_venta:any, cargo:any , rol_id: any, password: any): Observable<any> {
    return this.http.post(this.url + "registeradmin", { name: name, cedula: cedula, email: email, p_venta: p_venta ,cargo: cargo , rol_id: rol_id, password: password });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../modelos/users';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  url='http://127.0.0.1:8000/api/users';
  constructor(private http:HttpClient){
  }
    getUserss(access_token:any):Observable<any>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      });
      const options = { headers: headers};
      return this.http.get("http://127.0.0.1:8000/api/users", options);
    }

    addUsers(users : Users, access_token:any):Observable<any>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      });
      const options = { headers: headers};
      return this.http.post(this.url,users, options);
    }

    getUsers(access_token:any):Observable<any>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      });
      const options = { headers: headers};
      return this.http.get(this.url+"all",options);
    }
    
    updateUsers(id:string, users:Users, access_token:any):Observable<any>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      });
      const options = { headers: headers};
      return this.http.put(this.url+"/"+id,users, options);         
    }

    deleteUsers(id:string, access_token:any):Observable<any>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      });
      const options = { headers: headers};
      return this.http.delete(this.url+"/"+id, options);
    }
}
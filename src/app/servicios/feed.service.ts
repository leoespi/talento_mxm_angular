import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feed } from '../modelos/feed';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  //url prueba  (SOLO SE USA PARA CARGAR EL POR LA IP DEL COMPUTADOR)
  //private  baseUrl =  'http://192.168.1.148:8000/api';


  private baseUrl = 'http://localhost:8000/api';
  private feedsUrl = `${this.baseUrl}/feeds`;
  private feedsdeleteUrl = `${this.baseUrl}/feeds/`;

  constructor(private http: HttpClient) {}

  getAllFeeds(access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };

    return this.http.get<any>(`${this.baseUrl}/feeds`, options);
  }

  createFeed(feed: Feed, access_token: string, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + access_token
    });

    // Agregar user_id al FormData
    formData.append('user_id', feed.user_id.toString());

    return this.http.post(this.feedsUrl, formData, { headers });
  }

  deleteFeeds(id: string, access_token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    });
    const options = { headers: headers };
    return this.http.delete(this.feedsdeleteUrl + id, options);
  }
}

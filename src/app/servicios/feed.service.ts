import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { Feed } from '../modelos/feed';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
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

  return this.http.get<any>(`${this.baseUrl}/feeds`, options).pipe(
   
  );
}


createFeed(feed: Feed, access_token: string, formData: FormData): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + access_token
  });

  // Agregar user_id al FormData
  formData.append('user_id', feed.user_id.toString());

  return this.http.post(this.feedsUrl, formData, { headers });
}


deleteFeeds(id:string, access_token:any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token
  });
  const options = { headers: headers};
  return this.http.delete(this.feedsdeleteUrl +id, options);

}

}

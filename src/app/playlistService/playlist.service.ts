import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  url = 'http://ec2-35-154-10-191.ap-south-1.compute.amazonaws.com:9000/api/';
  headers = { 'Access-Control-Allow-Origin': '*' };
  constructor(private http: HttpClient, private toast: ToastrService) {

  }

  getPlaylist(): Observable<any> {
    // tslint:disable-next-line: max-line-length
    if (JSON.parse(localStorage.getItem('user'))) {
      this.headers = Object.assign(this.headers, { 'Content-Type': 'application/json', 'access-token': JSON.parse(localStorage.getItem('user')).idToken });
    }

    console.log(this.headers);
    return this.http.get(this.url + 'playlist', { headers: this.headers }).pipe(map((res: any) => {
      console.log(res);
      if (res.status === 200) {
        return res.response;
      }
      else {
        this.toast.error(res.response);
        return [];
      }
    }));
  }
  getPlaylistByID(id): Observable<any> {
    // tslint:disable-next-line: max-line-length
    if (JSON.parse(localStorage.getItem('user'))) {

      this.headers = Object.assign(this.headers, { 'Content-Type': 'application/json', 'access-token': JSON.parse(localStorage.getItem('user')).idToken });
      console.log(this.headers);
    }

    return this.http.get(this.url + 'playlist/id?id=' + id, { headers: this.headers }).pipe(map((res: any) => {
      console.log(res);
      if (res.status === 200) {
        return res.response;
      }
      else {
        this.toast.error(res.response);

        return null;
      }
    }));
  }


  postUser(data): Observable<any> {
    if (JSON.parse(localStorage.getItem('user'))) {

      this.headers = Object.assign(this.headers, { 'Content-Type': 'application/json', 'access-token': JSON.parse(localStorage.getItem('user')).idToken });
    }

    console.log(this.headers);
    return this.http.post(this.url + 'user/newUser', data, { headers: this.headers }).pipe(map((res: any) => {
      return res;
    }));
  }

  postPlaylist(data): Observable<any> {
    if (JSON.parse(localStorage.getItem('user'))) {

      this.headers = Object.assign(this.headers, { 'Content-Type': 'application/json', 'access-token': JSON.parse(localStorage.getItem('user')).idToken });
    }

    return this.http.post(this.url + 'playlist', data, { headers: this.headers }).pipe(map((res: any) => {
      console.log(res);
      if (res.status != 201) {
        this.toast.error(res.response);

      }
      return res;
    }));
  }



  updatePlaylist(data): Observable<any> {
    if (JSON.parse(localStorage.getItem('user'))) {

      this.headers = Object.assign(this.headers, { 'Content-Type': 'application/json', 'access-token': JSON.parse(localStorage.getItem('user')).idToken });
    }
    console.log(data)
    return this.http.patch(this.url + 'playlist', data, { headers: this.headers }).pipe(map((res: any) => {
      console.log(res);
      if (res.status != 200) {
        this.toast.error(res.response);

      }
      else {
        this.toast.success('sucessful');

      }
      return res;
    }));
  }




  deleteSong(data): Observable<any> {
    if (JSON.parse(localStorage.getItem('user'))) {

      this.headers = Object.assign(this.headers, { 'Content-Type': 'application/json', 'access-token': JSON.parse(localStorage.getItem('user')).idToken });
    }

    return this.http.patch(this.url + 'playlist/deletesong', data, { headers: this.headers }).pipe(map((res: any) => {
      console.log(res);
      if (res.status != 200) {
        this.toast.error(res.response);

      }
      else {
        this.toast.info('Song Deleted');
      }
      return res;
    }));
  }
}


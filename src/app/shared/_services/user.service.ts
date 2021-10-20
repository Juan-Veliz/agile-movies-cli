import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http:HttpClient,
    private authService:AuthService
  ) { }

  route = `${environment.endpoint}/api/user`

  getToMe(){
    const headers = { Authorization: `${this.authService._session.token_type} ${this.authService._session.refresh}` };
    return this.http.get(`${this.route}/me`, {headers});
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(
    private http:HttpClient,
    private authService:AuthService
  ) { }

  route = `${environment.endpoint}/api/movies`;

  public editDataDetails: any = [];
  public subject = new Subject<any>();
  private messageSource = new  BehaviorSubject(this.editDataDetails);
  currentMessage = this.messageSource.asObservable();
  
  changeMessage(message: any) {
    this.messageSource.next(message)
  }

  getPopulars(params:any){
    const headers = { Authorization: `${this.authService._session.token_type} ${this.authService._session.refresh}` };
    return this.http.get(`${this.route}/popular`, {headers, params});
  }

  getNowPlayings(params:any){
    const headers = { Authorization: `${this.authService._session.token_type} ${this.authService._session.refresh}` };
    return this.http.get(`${this.route}/now_playing`, {headers, params});
  }

  getActors( id:number ){
    const headers = { Authorization: `${this.authService._session.token_type} ${this.authService._session.refresh}` };
    return this.http.get(`${this.route}/${id}/actors`, {headers});
  }
}

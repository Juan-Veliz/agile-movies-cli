import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_class/user';
import { tap } from 'rxjs/operators';
import { Session } from '../_class/session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http:HttpClient
  ) {
    if(localStorage['refresh'] !== undefined){
      this.session = JSON.parse(localStorage['refresh']);
    }
   }
  onLoginSuccess:EventEmitter<any> = new EventEmitter();
  onLogoutSuccess:EventEmitter<any> = new EventEmitter();
  route = `${environment.endpoint}/api/auth`;
  private session: Session = new Session();

  get isValid(): boolean{
    if (this.session && this.session.expire !== undefined) {
      return Date.now() < this.session.expire;
    } else {
      return false;
    }
  }

  get isNew(): boolean{
    return (localStorage["refresh"]===undefined);
  }

  get _session() {
    return this.session;
  }

  login(user:User) {
    return this.http.post(`${this.route}/login`, user)
      .pipe(
        tap((data:any)=>{
          let token = data.data.payload.token;
          this.session.expire = (JSON.parse(atob(token.split('.')[1])).exp*1000);
          this.session.refresh = data.data.payload.refresh_token;
          this.session.token_type = data.data.payload.type;
          localStorage['refresh'] = JSON.stringify(this.session);
          this.onLoginSuccess.emit();
        })
      )
  }

  logout(){
    this.session = new Session();
    delete localStorage['refresh'];
    this.onLogoutSuccess.emit();
  }

  refresh() {

    return this.http.post(`${this.route}/refresh`, {refresh_token: this.session.refresh})
      .pipe(
        tap((data:any)=> {
          let token = data.data.payload.token;
          this.session.expire = (JSON.parse(atob(token.split('.')[1])).exp*1000);
          this.session.token_type = data.data.payload.type;
          this.onLoginSuccess.emit()
        } )
      )
  }

  getSecondForExpire() {
    if (this.session && this.session.expire !== undefined) {
      return Date.now() - this.session.expire;
    } else {
      return 0;
    }
  }
}

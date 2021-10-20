import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../shared/_class/user';
import { AuthService } from '../shared/_services/auth.service';
import { UserService } from '../shared/_services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(
    private authService:AuthService,
    private userService:UserService
  ) { }

  user:User = new User({});
  subLogin: any;
  isCollapsed = true;
  ngOnInit(): void {
    if(this.authService.isValid){
      this.getUser();
    }

    if (this.subLogin) {
      this.subLogin.unsuscribe();
    }
    this.subLogin = this.authService.onLoginSuccess.subscribe(()=>{
      this.getUser();
    })

  }

  ngOnDestroy(): void {
    this.subLogin.unsubscribe();
  }

  getUser(){
    this.userService.getToMe()
      .subscribe((data:any)=>{
        this.user = data.data
      })
  }

  logout(){
    this.authService.logout();
  }
 

}

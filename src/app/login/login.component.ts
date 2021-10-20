import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/_class/user';
import { AuthService } from '../shared/_services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private modalService:NgbModal,
    private toastrService:ToastrService
  ) { }

  @ViewChild('login', { static: true }) private content: TemplateRef<any> | any;

  user:User = new User({username:'', password:''});
  modalRef: NgbModalRef | undefined;
  form: FormGroup = User.formControl(this.user);
  subLogin = new Subscription();
  timerLogin:any;

  ngOnInit(): void {
    if(this.authService.isNew){
      this.open();
    }
    else{
      this.refresh();
    }

    this.authService.onLogoutSuccess.subscribe(()=>{
      this.open();
    })
  }

  open(){
    this.modalRef = this.modalService.open(this.content, {
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
    })
  }

  onSubmit(){
    const model = new User(this.form.value);
    this.authService.login(model)
      .subscribe(data=>{
        this.toastrService.success("ACCESO PERMITIDO")
        this.modalRef?.close();
      }, (err)=>{
        this.toastrService.error("username o password incorrectos")
      })
  }

  refresh(){
    this.authService.refresh()
      .subscribe(data=>{
      }, (err)=>{
        this.open();
      })
  }

}

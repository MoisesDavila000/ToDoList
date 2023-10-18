import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  alert: boolean = false;

  loginForm : FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(5)]],
    pass: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ){}


  ngOnInit(){

  }


  submitForm(){
    let {email, pass} = this.loginForm.value;
    if(this.loginForm.valid){
        this.authService.login(email, pass).subscribe((res: HttpResponse<any>)=>{
          if(res.status === 200){
            this.router.navigateByUrl('/');
          }
        });
    }
    else{
      this.alert = true;
    }
  }

  close(){
    this.alert = false;
  }
}

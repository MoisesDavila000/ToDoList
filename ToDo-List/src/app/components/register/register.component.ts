import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  alert: boolean = false;

  registerForm : FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.minLength(5)]],
    pass: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authSerivce: AuthService
  ){}


  ngOnInit(){

  }


  submitForm(){
    let {name, email, pass} = this.registerForm.value;
    if(this.registerForm.valid){
      try{
        this.authSerivce.register(name, email, pass).subscribe((res: HttpResponse<any>) => {
          if(res.status === 200){
            this.router.navigateByUrl('/');
          }
        });
      }catch{
        this.alert = true;
      }
    }
    else{
      this.alert = true;
    }
  }

  close(){
    this.alert = false;
  }
}

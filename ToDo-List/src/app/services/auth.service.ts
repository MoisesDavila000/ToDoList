import { Injectable } from '@angular/core';
import { RequestsService } from './requests.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private webRequest: RequestsService,
    private http: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string){
    return this.webRequest.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
      this.setSession(res.headers.get('name')!, res.headers.get('token')!);
    })
    );
  }

  register(name: string, email: string, password: string){
    return this.webRequest.register(name, email, password).pipe(shareReplay(), tap((res: HttpResponse<any>) => {
      this.setSession(res.headers.get('name')!, res.headers.get('token')!);
    })
    );
  }

  validateToken(){
    return this.webRequest.validate(this.getToken()!).pipe(shareReplay(), tap((res: HttpResponse<any>) =>{
      if(res.status !== 200){
        this.logout();
      }
    }
    ));
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  getUser(){
    return localStorage.getItem('user');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  private setSession(user: string, token: string){
    localStorage.setItem('user', user);
    localStorage.setItem('token', token);
    this.router.navigateByUrl('/');
  }

}

import { Injectable } from '@angular/core';
import { RequestsService } from './requests.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private webRequest: RequestsService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  getTasks(){
    const token: string = this.authService.getToken()!;
    const headers = {'token': token};
    return this.webRequest.get("tasks", new HttpHeaders(headers));
  }

  addTask(payload: Object){
    const token: string = this.authService.getToken()!;
    const headers = {'token': token};
    return this.webRequest.post("tasks", payload, new HttpHeaders(headers));
  }

  editTask(taskId: string, payload: Object){
    const token: string = this.authService.getToken()!;
    const headers = {'token': token};
    return this.webRequest.patch(`tasks/${taskId}`, payload, new HttpHeaders(headers));
  }

  deleteTask(taskId: string){
    const token: string = this.authService.getToken()!;
    const headers = {'token': token};
    return this.webRequest.delete(`tasks/${taskId}`, new HttpHeaders(headers));
  }
}

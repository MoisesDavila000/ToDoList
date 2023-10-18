import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  readonly ROOT_URL;

  constructor(
    private http: HttpClient
  ) {
    this.ROOT_URL = environment.ROOTURL;
  }

  get(uri: string, header: HttpHeaders){
    return this.http.get(`${this.ROOT_URL}/${uri}`, {headers: header});
  }

  post(uri: string, payload: Object, header: HttpHeaders){
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload,  {headers: header});
  }

  patch(uri: string, payload: Object, header: HttpHeaders){
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload,  {headers: header});
  }

  delete(uri: string, header: HttpHeaders){
    return this.http.delete(`${this.ROOT_URL}/${uri}`,  {headers: header});
  }

  login(email: string, password: string){
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email: email,
      password: password
    }, {observe: 'response'});
  }

  register(name: string, email: string, password: string){
    return this.http.post(`${this.ROOT_URL}/users`, {
      name,
      email,
      password
    }, {observe: "response"});
  }

  validate(token: string){
    const headerDict = {
      'token': token
    }

    return this.http.post(`${this.ROOT_URL}/users/validate`, {}, {headers: new HttpHeaders(headerDict), observe: 'response'});
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router, Data } from '@angular/router';
import { environment } from '../../environments/environment';


const BACKEDN_URL = environment.apiUrl +"/user/";

@Injectable({providedIn: 'root'})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken() {
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string,password: string) {

    const authData: AuthData  = { email: email,password: password};
    this.http.post(BACKEDN_URL+ "/signup", authData)
    .subscribe(() => {
      // console.log(response);
      this.router.navigate["/"];
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData  = { email: email,password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEDN_URL + "login", authData)
    .subscribe(response => {
      // console.log(response);
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000) ;
        this.saveAuthData(token, expirationDate, this.userId);
        // console.log(expirationDate);
        this.router.navigate(['/']);
      }

    }, error => {
      this.authStatusListener.next(false);
    });

}
  private setAuthTimer(duration: number){

        // console.log("timer" + duration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000 );
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationData.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if (expiresIn > 0 ) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationData: Data, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationData.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId')
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationData = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationData) {
      return;
    }
    return {
      token: token,
      expirationData: new Date(expirationData),
      userId: userId
    }

  }
}

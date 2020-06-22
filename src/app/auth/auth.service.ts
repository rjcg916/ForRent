import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated = true;
  private _userId = "2";


  constructor(private httpClient: HttpClient) { }

  get userId () {
    return this._userId;
  }

  get userIsAuthenticated() {
    return this._isAuthenticated;
  }

  signUp(email: string, password: string) {
    this.httpClient.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="${environment.authAPIKey}"`)

  }
  login() {
    this._isAuthenticated = true;
  }

  logout() {
    this._isAuthenticated = false;
  }
}

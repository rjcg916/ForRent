import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated = false;

  constructor() { }

  get userIsAuthenticated() {
    return this._isAuthenticated;
  }

  login() {
    this._isAuthenticated = true;
  }

  logout() {
    this._isAuthenticated = false;
  }
}

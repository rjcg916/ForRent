import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service'
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  loginMode = false;
  constructor( private authService : AuthService,
               private router: Router,
               private loadingController : LoadingController) { }

  ngOnInit() {
  }
 
  login() {
    this.authService.login();
    this.isLoading = true;
    this.loadingController.create({keyboardClose: true, message: 'Logging in ...'}).then(
      controllerElem => { 
        controllerElem.present();
        setTimeout( () => {
          controllerElem.dismiss();
          this.router.navigateByUrl("/");
          this.isLoading = false;
        } ,1500);
      }
    );

    
  }

  logout() {
    this.authService.logout();
  }
   
  onSubmit(form : NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    console.log(email, password);
    
  } 


  onSwitchAuthMode() {
    this.loginMode = !this.loginMode
  }

}

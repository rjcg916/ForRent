import { Component, OnInit } from "@angular/core";
import { AuthService, IAuthResponseData } from "./auth.service";
import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  isLoading = false;
  loginMode = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;

    this.loadingController
      .create({ keyboardClose: true, message: "Logging in ..." })
      .then((controllerElem) => {
        controllerElem.present();
        let authObservable: Observable<IAuthResponseData>;
        if (this.loginMode) {
          authObservable = this.authService.login(email, password);
        } else {
          authObservable = this.authService.signUp(email, password);
        }

        authObservable.subscribe(
          (result) => {
            console.log(result);
            this.isLoading = false;
            controllerElem.dismiss();
            this.router.navigateByUrl("/places/tabs/discover");
          },
          (errorResponse) => {

            controllerElem.dismiss();
            const code = errorResponse.error.error.message;
            let message = "Could not sign you up. Please try again";
            if (code === "EMAIL_EXISTS") {
              message = "This email already exists.  Please login.";
            } else if (code === "EMAIL_NOT_FOUND") {
              message = "Email and/or Password invalid.";
            } else if (code === "INVALID_PASSWORD") {
              message = "Email and/or Password invalid.";
            }

            this.showAlert(message);
          }
        );
      });
  }

  onLogout() {
    this.authService.logout();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  private showAlert(message: string) {
    this.alertController
      .create({
        header: "Authentication failed",
        message: message,
        buttons: ["OK"],
      })
      .then((element) => {
        element.present();
      });
  }

  onSwitchAuthMode() {
    this.loginMode = !this.loginMode;
  }
}

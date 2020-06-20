import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NavController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { AppConstants } from "../../../constants";
import { PlacesService } from "../../places.service";
import { Place } from "../../place.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  isLoading = false;
  private placeSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack(AppConstants.pathToOffers);
        return;
      }
      this.placeId = paramMap.get("placeId");
      this.isLoading = true;
      this.placeSub = this.placesService.getPlace(this.placeId).subscribe(
        (place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: "blur",
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              updateOn: "blur",
              validators: [Validators.required, Validators.maxLength(180)],
            }),
          });
          this.isLoading = false;
        },
        (error) => {
          this.alertController.create({
            header: "An Error Occurred",
            message: "Place cound not be found. Please try with another id.",
            buttons: [{text: 'Okay', handler: () => { 
              this.router.navigate(['/places/tabs/offers']);
            }}],
          }).then( element => {
            element.present();
          });
        }
      );
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onUpdateOffer() {
    if (!this.form.valid) return;

    this.loadingController
      .create({ message: "Updating place..." })
      .then((element) => {
        element.present();
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            element.dismiss();
            this.form.reset();
            this.router.navigate(["/places/tabs/offers"]);
          });
      });
  }
}

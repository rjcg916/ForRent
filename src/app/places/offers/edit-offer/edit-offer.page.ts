import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { AppConstants } from "../../../constants";
import { PlacesService } from "../../places.service";
import { Place } from "../../place.model";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private placeSub: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack(AppConstants.pathToOffers);
        return;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get("placeId")).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title : new FormControl(this.place.title, { updateOn: 'blur', validators: [Validators.required]}),
          description : new FormControl(this.place.description, {updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)]}),
        });   

      });

    });

  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onEditOffer() {
    if (!this.form.valid)
      return;
    console.log(this.form);
  }
}

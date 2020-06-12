import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { AppConstants } from "../../../constants";
import { PlacesService } from "../../places.service";
import { Place } from "../../place.model";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"],
})
export class EditOfferPage implements OnInit {
  place: Place;
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
      this.place = this.placesService.getPlace(paramMap.get("placeId"));
    });
  }
}

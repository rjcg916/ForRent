import { Component, OnInit } from "@angular/core";
import {
  NavController,
  ModalController,
  ActionSheetController,
} from "@ionic/angular";
import { AppConstants } from "../../../constants";
import { ActivatedRoute } from "@angular/router";
import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";
import { CreateBookingComponent } from "../../../bookings/create-booking/create-booking.component";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit {
  place: Place;
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack(AppConstants.pathToDiscover);
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get("placeId"));
    });
  }

  Book() {
    this.actionSheetController.create({
      header: "Choose an Option",
      buttons: [
        {
          text: "Select Dates",
          handler: () => {
            this.openModal("select");
          },
        },
        {
          text: "Random Dates",
          handler: () => {
            this.openModal("random");
          },
        },
        { text: "Cancel", role: "cancel" },
      ],
    }).then(actionSheetElement => {
      actionSheetElement.present();
    });

    //  this.navController.navigateBack(AppConstants.pathToDiscover);
  }

  openModal(mode: "select" | "random") {
    this.modalController
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
      });
  }
}

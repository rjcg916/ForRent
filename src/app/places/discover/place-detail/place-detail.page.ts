import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { AppConstants } from "../../../constants";
import { ActivatedRoute, Router } from "@angular/router";
import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";
import { CreateBookingComponent } from "../../../bookings/create-booking/create-booking.component";
import { Subscription } from "rxjs";
import {switchMap} from 'rxjs/operators';
import { BookingService } from "../../../bookings/booking.service";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  isBookable = false;
  isLoading = false;
  
  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navController.navigateBack(AppConstants.pathToDiscover);
        return;
      }
      this.isLoading = true;
      let fetchUserId : string;
      this.authService.userId.pipe(
        switchMap( userId => {
          if (!userId ) {
            throw new Error('User not found!');
          } 
          fetchUserId = userId;
          return this.placesService.getPlace(paramMap.get('placeId'));
        })
      )
       .subscribe(
          (place) => {
            this.place = place;
            this.isBookable = place.userId !== fetchUserId;
            this.isLoading = false;
          },
          (error) => {
            this.alertController
              .create({
                header: "An Error Occured",
                message: "Invalid/Unknown Place",
                buttons: [{ text: "Ok", handler: () => {this.router.navigate(['/places/tabs/discover'])} }]
              })
              .then(
                element => {
                  element.present();
                }
              );
          }
        );
    });
  }

  Book() {
    this.actionSheetController
      .create({
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
      })
      .then((actionSheetElement) => {
        actionSheetElement.present();
      });
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

        if (resultData.role === "confirm") {
          this.loadingController
            .create({ message: "Booking place..." })
            .then((element) => {
              element.present();
              const bookingData = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  bookingData.firstName,
                  bookingData.lastName,
                  bookingData.numberOfGuests,
                  bookingData.startDate,
                  bookingData.endDate
                )
                .subscribe(() => {
                  element.dismiss();
                });
            });
        }
      });
  }
}

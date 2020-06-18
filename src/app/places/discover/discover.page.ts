import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "../place.model";
import { PlacesService } from "../places.service";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";
import { MenuController } from "@ionic/angular";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit, OnDestroy {
  places: Place[];
  listedPlaces: Place[];
  relevantPlaces: Place[];

  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuController: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.places = places;
      this.relevantPlaces = this.places;
      this.listedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === "all") {
      this.relevantPlaces = this.places;
    } else {
      this.relevantPlaces = this.places.filter(
        (p) => p.userId !== this.authService.userId
      );
    }
    if (this.listedPlaces) {
    this.listedPlaces = this.relevantPlaces.slice(1);
    }
  }
}

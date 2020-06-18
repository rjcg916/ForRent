import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { take, map, tap, delay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      "p1",
      "London Flat",
      "Smashing",
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/City_of_London_skyline_from_London_City_Hall_-_Sept_2015_-_Crop_Aligned.jpg",
      129.99,
      new Date("2020-06-01"),
      new Date("2021-12-31"),
      "1"
    ),
    new Place(
      "p2",
      "Mongolian Yurt",
      "Baby its cold outside",
      "https://i1.wp.com/upload.wikimedia.org/wikipedia/commons/b/be/Mongolian_yurt2013.jpg",
      78.97,
      new Date("2020-06-01"),
      new Date("2021-12-31"),
      "1"
    ),
    new Place(
      "p3",
      "Arizona TeePee",
      "a little hot",
      "https://www.roadsideamerica.com/attract/images/az/AZHOLwigwam_3487.jpg",
      49.99,
      new Date("2020-06-01"),
      new Date("2021-12-31"),
      "1"
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const currentPlaceIndex = places.findIndex((p) => p.id === placeId);
        const updatedPlaces = [...places];
        const currentPlace = updatedPlaces[currentPlaceIndex];
        updatedPlaces[currentPlaceIndex] = new Place(
          currentPlace.id,
          title,
          description,
          currentPlace.imageUrl,
          currentPlace.price,
          currentPlace.availableFrom,
          currentPlace.availableTo,
          currentPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      "p234",
      title,
      description,
      "https://www.roadsideamerica.com/attract/images/az/AZHOLwigwam_3487.jpg",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }
}

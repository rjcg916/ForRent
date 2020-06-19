import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";

interface IPlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  // new Place(
  //   "p1",
  //   "London Flat",
  //   "Smashing",
  //   "https://upload.wikimedia.org/wikipedia/commons/6/6d/City_of_London_skyline_from_London_City_Hall_-_Sept_2015_-_Crop_Aligned.jpg",
  //   129.99,
  //   new Date("2020-06-01"),
  //   new Date("2021-12-31"),
  //   "1"
  // ),
  // new Place(
  //   "p2",
  //   "Mongolian Yurt",
  //   "Baby its cold outside",
  //   "https://i1.wp.com/upload.wikimedia.org/wikipedia/commons/b/be/Mongolian_yurt2013.jpg",
  //   78.97,
  //   new Date("2020-06-01"),
  //   new Date("2021-12-31"),
  //   "1"
  // ),
  // new Place(
  //   "p3",
  //   "Arizona TeePee",
  //   "a little hot",
  //   "https://www.roadsideamerica.com/attract/images/az/AZHOLwigwam_3487.jpg",
  //   49.99,
  //   new Date("2020-06-01"),
  //   new Date("2021-12-31"),
  //   "2"
  // ),

  private placesServiceUrl =
    "https://forrent-5cf25.firebaseio.com/offered-places.json";

  private placesServicePutUrl =
    "https://forrent-5cf25.firebaseio.com/offered-places/";

  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: IPlaceData }>(this.placesServiceUrl)
      .pipe(
        map((result) => {
          const places = [];
          for (const key in result) {
            const data = result[key];
            if (result.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  data.title,
                  data.description,
                  data.imageUrl,
                  data.price,
                  new Date(data.availableTo),
                  new Date(data.availableTo),
                  data.userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        const currentPlaceIndex = places.findIndex((p) => p.id === placeId);
        updatedPlaces = [...places];
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
        return this.httpClient.put(
          `https://forrent-5cf25.firebaseio.com/offered-places/${placeId}/.json`,
          { ...updatedPlaces[currentPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     const currentPlaceIndex = places.findIndex((p) => p.id === placeId);
    //     const updatedPlaces = [...places];
    //     const currentPlace = updatedPlaces[currentPlaceIndex];
    //     updatedPlaces[currentPlaceIndex] = new Place(
    //       currentPlace.id,
    //       title,
    //       description,
    //       currentPlace.imageUrl,
    //       currentPlace.price,
    //       currentPlace.availableFrom,
    //       currentPlace.availableTo,
    //       currentPlace.userId
    //     );
    //     this._places.next(updatedPlaces);
    //   })
    // );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://www.roadsideamerica.com/attract/images/az/AZHOLwigwam_3487.jpg",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this.httpClient
      .post<{ name: string }>(this.placesServiceUrl, { ...newPlace, id: null })
      .pipe(
        switchMap((result) => {
          generatedId = result.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }
}

import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";

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
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}
  
  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: IPlaceData }>(
        `${environment.serviceUrlRoot}/offered-places.json`
      )
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



  getPlace(id: string) {
    return this.httpClient
      .get<IPlaceData>(
        `${environment.serviceUrlRoot}/offered-places/${id}/.json`
      )
      .pipe(
        map((place) => {
          return new Place(
            id,
            place.title,
            place.description,
            place.imageUrl,
            place.price,
            new Date(place.availableFrom),
            new Date(place.availableTo),
            place.userId
          );
        })
      );
  }

  updatePlace(id: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const currentPlaceIndex = places.findIndex((p) => p.id === id);
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
          `${environment.serviceUrlRoot}/offered-places/${id}/.json`,
          { ...updatedPlaces[currentPlaceIndex], id: null }
        );
      }),
      tap(() => {
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
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error("No User Found!");
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          "https://www.roadsideamerica.com/attract/images/az/AZHOLwigwam_3487.jpg",
          price,
          dateFrom,
          dateTo,
          userId
        );
        return this.httpClient.post<{ name: string }>(
          `${environment.serviceUrlRoot}/offered-places.json`,
          { ...newPlace, id: null }
        );
      }),

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
  }
}

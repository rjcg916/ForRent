import { Injectable } from "@angular/core";
import { Place } from "./place.model";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places: Place[] = [
    new Place("p1", "London Flat", "Smashing", "https://upload.wikimedia.org/wikipedia/commons/6/6d/City_of_London_skyline_from_London_City_Hall_-_Sept_2015_-_Crop_Aligned.jpg", 129.99, new Date('2020-06-01'), new Date('2021-12-31'), '1'),
    new Place("p2", "Mongolian Yurt", "Baby its cold outside", "https://i1.wp.com/upload.wikimedia.org/wikipedia/commons/b/be/Mongolian_yurt2013.jpg", 78.97, new Date('2020-06-01'), new Date('2021-12-31') ,'1'),
    new Place("p3", "Arizona TeePee", "a little hot", "https://www.roadsideamerica.com/attract/images/az/AZHOLwigwam_3487.jpg", 49.99, new Date('2020-06-01'), new Date('2021-12-31'), '1'),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}

  getPlace(id : string) : Place {
    return {...this.places.find( p => p.id === id)}
  }

  addPlace( newPlace : Place) {

    this._places.push(newPlace);
  }

} 

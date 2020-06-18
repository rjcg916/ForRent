import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from './places.service';
import {Place} from './place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements OnInit, OnDestroy {
  private placesSub : Subscription;
  places: Place[];
  constructor(private placesService : PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe( places => {
      this.places = places;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}

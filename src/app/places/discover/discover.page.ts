import { Component, OnInit, OnDestroy } from '@angular/core';
import {Place} from '../place.model';
import { PlacesService } from '../places.service';
import {SegmentChangeEventDetail} from '@ionic/core'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  places : Place[];
  private placesSub : Subscription;

  constructor(private placesService: PlacesService) { }

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
  onFilterUpdate(event : CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }
}

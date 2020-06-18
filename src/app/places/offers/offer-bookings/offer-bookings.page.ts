import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController} from '@ionic/angular';
import { AppConstants} from '../../../constants';
import { Place } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  private placeSub : Subscription;
  place : Place;
  constructor(private navController : NavController,
              private activatedRoute: ActivatedRoute,
              private placesService : PlacesService) { }

  ngOnInit() {
    this.placeSub = this.activatedRoute.paramMap.subscribe( paramMap => {
      if(!paramMap.has('placeId')) {
        this.navController.navigateBack(AppConstants.pathToOffers);
        return;
      }
        this.placesService.getPlace(paramMap.get('placeId')).subscribe( place => {
          this.place = place;
        });
      
    })
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe()
    }
  }
  Book() {
    //this.router.navigateByUrl(AppConstants.pathToDiscover);
    this.navController.navigateBack(AppConstants.pathToOffers);
  }
}

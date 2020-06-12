import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular';
import { AppConstants} from '../../../constants';
import { Place } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

  place : Place;
  constructor(private navController : NavController,
              private activatedRoute: ActivatedRoute,
              private placesService : PlacesService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( paramMap => {
      if(!paramMap.has('placeId')) {
        this.navController.navigateBack(AppConstants.pathToOffers);
        return;
      }
        this.place = this.placesService.getPlace(paramMap.get('placeId'));
      
    })
  }
  Book() {
    //this.router.navigateByUrl(AppConstants.pathToDiscover);
    this.navController.navigateBack(AppConstants.pathToOffers);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking} from './booking.model';
import { IonItemSliding, LoadingController} from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings : Booking[];
  bookingsSub: Subscription;
  constructor(private bookingsService : BookingService,
              private loadingController : LoadingController) { }

  ngOnInit() {
    this.bookingsSub = this.bookingsSub = this.bookingsService.bookings.subscribe( bookings => {
      this.bookings = bookings;
    });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }
  onCancelBooking( bookingId : string, itemSlider: IonItemSliding) {
      itemSlider.close();
      this.loadingController.create( {message: 'Cancelling...'}
      ).then( element => {
        element.present();
        this.bookingsService.cancelBooking(bookingId).subscribe();
        element.dismiss();
      });

      
  }
}

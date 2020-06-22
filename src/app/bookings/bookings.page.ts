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
  isLoading = false;
  private bookingsSub: Subscription;

  constructor(private bookingsService : BookingService,
              private loadingController : LoadingController) { }

  ngOnInit() {
    this.bookingsSub = this.bookingsService.bookings.subscribe( bookings => {
      this.bookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
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

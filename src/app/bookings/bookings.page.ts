import { Component, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking} from './booking.model';
import { IonItemSliding} from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings : Booking[];
  constructor(private bookingsService : BookingService) { }

  ngOnInit() {
    this.bookings = this.bookingsService.bookings;
  }

  edit( bookingId : string, itemSlider: IonItemSliding) {
      itemSlider.close();
  }
}

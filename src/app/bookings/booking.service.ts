import { Injectable } from '@angular/core';
import { Booking} from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings : Booking[] = [

    new Booking("b1", "p1", "u1", "Place 1", 2),

  ];
  constructor() { }

  get bookings() {
    return [...this._bookings];
  }
}

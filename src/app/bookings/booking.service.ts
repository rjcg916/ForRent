import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, map, tap, delay } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);


  constructor(private authService: AuthService) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  getBooking(id: string) {
    return this.bookings.pipe(
      take(1),
      map((bookings) => {
        return { ...bookings.find((b) => b.id === id) };
      })
    );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    numOfGuest: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random.toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      lastName,
      firstName,
      numOfGuest,
      dateFrom,
      dateTo
    );

    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    ); 
  }

  cancelBooking(id: string) {

    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        const currentBookingIndex = bookings.findIndex((b) => b.id === id);
        bookings.splice(currentBookingIndex, 1);
        this._bookings.next(bookings);
      })
    );
  }
}

import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class BookingService {
  private bookingsServiceUrl =
    "https://forrent-5cf25.firebaseio.com/available-bookings.json";
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

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

 
    let generatedId: string;
    
    return this.httpClient
      .post<{ name: string }>(this.bookingsServiceUrl, {
        ...newBooking,
        id: null,
      })
      .pipe(
        switchMap((result) => {
          generatedId = result.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
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

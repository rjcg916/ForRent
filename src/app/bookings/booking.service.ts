import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, map, tap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

interface IBookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  lastName: string;
  numberOfGuests: number;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

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

  fetchBookings() {
    return this.httpClient
      .get<{ [key: string]: IBookingData }>(`https://forrent-5cf25.firebaseio.com/available-bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
      .pipe(
        map((bookingData) => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              
              bookings.push(
                new Booking(
                  key,
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].placeImage,
                  bookingData[key].lastName,
                  bookingData[key].firstName,
                  bookingData[key].numberOfGuests,
                  new Date(bookingData[key].bookedFrom),
                  new Date(bookingData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap( bookings => {
          this._bookings.next(bookings);
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
    return this.httpClient.delete(`https://forrent-5cf25.firebaseio.com/available-bookings/${id}.json`)
    .pipe(switchMap( () => {
      return this.bookings
    }),
    take(1),
    tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== id));
    })
   
    );
  }
}

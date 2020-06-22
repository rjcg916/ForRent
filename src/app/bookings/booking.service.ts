import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, map, tap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

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
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() {
    return this.authService.userId.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error("User Id not found.");
        }
        return this.httpClient.get<{ [key: string]: IBookingData }>(
          `${environment.serviceUrlRoot}/available-bookings.json?orderBy="userId"&equalTo="${userId}"`
        );
      }),
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
      tap((bookings) => {
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
    let generatedId: string;
    let newBooking: Booking;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error("No User Id Found");
        }
        newBooking = new Booking(
          Math.random.toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          lastName,
          firstName,
          numOfGuest,
          dateFrom,
          dateTo
        );

        return this.httpClient.post<{ name: string }>(
          `${environment.serviceUrlRoot}/available-bookings.json`,
          {
            ...newBooking,
            id: null,
          }
        );
      }),
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
    return this.httpClient
      .delete(`${environment.serviceUrlRoot}/available-bookings/${id}.json`)
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          this._bookings.next(bookings.filter((b) => b.id !== id));
        })
      );
  }
}

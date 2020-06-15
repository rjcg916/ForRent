import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from '../../places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace : Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', {static: true}) form: NgForm;
  startDate : string;
  endDate : string;

  constructor(private modalController : ModalController) { }

  ngOnInit() {

  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValid())
      return;

    this.modalController.dismiss({bookingData: {
      firstName: this.form.value['first-name'],
      lastName : this.form.value['last-name'],
      numberOfGuests : this.form.value['number-of-guests'],
      startDate : this.form.value['date-from'],
      endDate : this.form.value['date-to']
    }
    }, 'confirm');
  }
  
  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = new Date( this.form.value['date-from']);
    const endDate = new Date( this.form.value['date-to']);
    return endDate > startDate;
  }
}


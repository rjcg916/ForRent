import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor(private placesService : PlacesService,
              private authService : AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      title : new FormControl(null, { updateOn: 'blur', validators: [Validators.required]}),
      description : new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)]}),
      price : new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.min(1)]}),
      dateFrom : new FormControl(null, {updateOn: 'blur', validators :[Validators.required]}),
      dateTo : new FormControl(null, {updateOn: 'blur', validators: [Validators.required]})
    });
  }

  onCreateOffer() {
    if (!this.form.valid)
    return;
    
    
     let newPlace = new Place(
      Math.random.toString(), this.form.value.title, this.form.value.description, "https://www.roadsideamerica.com/attract/images/az/AZHOLwigwam_3487.jpg", 
                              this.form.value.price, new Date( this.form.value.dateFrom), new Date(this.form.value.dateTo), this.authService.userId);

    this.placesService.addPlace(newPlace);


  }
}

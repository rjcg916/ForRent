export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeTitle: string,
    public placeImage: string,
    public lastName: string,
    public firstName: string,
    public numberOfGuests: number,
    public bookedFrom: Date,
    public bookedTo: Date
  ) {}
}

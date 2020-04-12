import { SimpleCoordinates } from './simple-coordinates';

export class GpsHistory {
    public time: Date;
    public location: SimpleCoordinates;

    constructor(location: SimpleCoordinates, time?: Date) {
        this.location = location;
        this.time = (time != undefined ? time : new Date());
    }
}

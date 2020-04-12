import { SimpleCoordinates } from './simple-coordinates';

export class GpsHistory {
    public time: Date;
    public coords: SimpleCoordinates;

    constructor(coords: SimpleCoordinates, time?: Date) {
        this.coords = coords;
        this.time = (time != undefined ? time : new Date());
    }
}

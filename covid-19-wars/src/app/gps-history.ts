import { SimpleCoordinates } from './simple-coordinates';
import { ForestStatus } from './forest-status.enum';

export class GpsHistory {
    public time: Date;
    public coords: SimpleCoordinates;
    public status: ForestStatus;

    constructor(coords?: SimpleCoordinates, time?: Date, status?: ForestStatus) {
        this.coords = coords;
        this.time = time;
        this.status = status;
    }
}

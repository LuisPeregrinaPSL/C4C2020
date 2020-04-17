import { SimpleCoordinates } from './simple-coordinates';
import { ForestStatus } from './forest-status.enum';

export class GpsHistory {
    public time: Date;
    public coords: SimpleCoordinates;
    public status: ForestStatus;
    public metersFromHome: number

    constructor(coords?: SimpleCoordinates, time?: Date, metersFromHome?: number) {
        this.coords = coords;
        this.time = time;
        this.metersFromHome = metersFromHome || 0;
    }
}

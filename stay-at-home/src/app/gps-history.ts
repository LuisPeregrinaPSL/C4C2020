import { SimpleCoordinates } from './simple-coordinates';
import { ForestStatus } from './forest-status.enum';

export class GpsHistory {
    public time: Date;
    public coords: SimpleCoordinates;
    public status: ForestStatus;
    public treeDiff: number;

    constructor(coords?: SimpleCoordinates, time?: Date, treeDiff?: number) {
        this.coords = coords;
        this.time = time;
        this.treeDiff = treeDiff || 0;
    }
}

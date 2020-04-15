import { SimpleCoordinates } from './simple-coordinates';
import { ForestStatus } from './forest-status.enum';

export class GpsHistory {
    public time: Date;
    public coords: SimpleCoordinates;
    public status: ForestStatus;
    public newTree: boolean

    constructor(coords?: SimpleCoordinates, time?: Date, status?: ForestStatus, newTree?: boolean) {
        this.coords = coords;
        this.time = time;
        this.status = status;
        this.newTree = newTree || false;
    }
}

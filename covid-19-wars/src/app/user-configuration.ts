import { SimpleCoordinates } from './simple-coordinates';

export class UserConfiguration {
    public vendor: string;
    public geolocation: boolean;
    public deviceId: string;
    public arboles: number;
    public casa: SimpleCoordinates;

    constructor() {
        this.vendor = "Default vendor";
        this.geolocation = false;
        this.deviceId = "Default device id";
        this.arboles = 0;
        this.casa = new SimpleCoordinates(0, 0);
    }
}

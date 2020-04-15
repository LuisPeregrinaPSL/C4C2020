import { SimpleCoordinates } from './simple-coordinates';

export class UserConfiguration {
    public vendor: string;
    public geolocationEnabled: boolean;
    public deviceId: string;
    public trees: number;
    public home: SimpleCoordinates;

    constructor() {
        this.vendor = "Default vendor";
        this.geolocationEnabled = false;
        this.deviceId = "Default device id";
        this.trees = 0;
        this.home = null;
    }
}

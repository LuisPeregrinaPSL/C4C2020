import { SimpleCoordinates } from './simple-coordinates';

export class UserConfiguration {
    public level: number;
    public geolocationEnabled: boolean;
    public deviceId: string;
    public trees: number;
    public home: SimpleCoordinates;

    constructor() {
        this.level = 0;
        this.geolocationEnabled = false;
        this.deviceId = "Default device id";
        this.trees = 0;
        this.home = null;
    }

}

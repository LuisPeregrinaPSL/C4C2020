import { SimpleCoordinates } from './simple-coordinates';

export class UserConfiguration {
    public vendor: string;
    public geolocationEnabled: boolean;
    public deviceId: string;
    private _trees: number;
    public home: SimpleCoordinates;

    constructor() {
        this.vendor = "Default vendor";
        this.geolocationEnabled = false;
        this.deviceId = "Default device id";
        this._trees = 0;
        this.home = null;
    }

    get trees() {
        return this._trees;
    }

    set trees(num) {
        this._trees = num;
    }
}

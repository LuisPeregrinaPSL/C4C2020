export class SimpleCoordinates {
    public latitude: number;
    public longitude: number;
    public accuracy: number; // Podemos prescindir de esto?

    constructor(lat: number, lon: number) {
        this.latitude = lat;
        this.longitude = lon;
    }

    public static fromString(str: string) {
        let coords = str.split(' ');
        return new SimpleCoordinates(Number(coords[0]), Number(coords[1]));
    }

    public toString() {
        return this.latitude.toString() + ' ' + this.longitude.toString();
    }
}

export class AppConfiguration {
    // Some details on the app
    /**
     * The IndexedDB will be saved like so under the device.
     */
    public static APP_DB_SCHEMA: string = 'c4c_mx_covid19'

    // Some business rules
    /**
     * Foreground timeout to trigger the GPS service.
     */
    public static GPS_CHECK_POSITION_TIMEOUT: number = 5000;
    /**
     * Background timeout to trigger the GPS service.
     */
    public static GPS_CHECK_POSITION_BACKGROUND_TIMEOUT: number = 3000;

    /**
     * Distance, in meters, to trigger the status from Growing to Shrinking.
     */
    public static DISTANCE_TO_HOUSE_THRESHOLD: number = 30;

    /**
     * Time, in milliseconds, that takes to get a new tree.
     */
    public static TIME_TO_GROW_TREE: number = 10000;

    /**
     * Working hours, in ms, time being from 0:00 to 23:59.
     */
    static get WORKING_HOURS() {
        let start = new Date();
        start.setHours(0, 0, 0);
        let end = new Date();
        end.setHours(23, 59, 59);
        return { start: start, end: end };
    }

    static WELCOME_FANFARE_TIMEOUT = 1000;
}

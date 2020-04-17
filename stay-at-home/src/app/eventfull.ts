import { Events } from './events.enum';

export class Eventfull {
    private callbackInfo: string[] = [];

    constructor() {
        for (let event in Events) {
            this.callbackInfo[event.toString()] = [];
        }
    }

    public addListener(event: Events, callback: Function) {
        if (!this.callbackInfo[event.toString()]) {
            console.error('Event name does not exists');
        } else {
            this.callbackInfo[event.toString()].push(callback);
        }
    }

    protected notifyEvent(event: Events, data: any) {
        console.log('Event triggered: ' + event.toString() + '. Notifying ' + this.callbackInfo[event.toString()].length + ' listeners.');
        this.callbackInfo[event.toString()].forEach(function (callback: Function) {
            callback(data);
        });
    }
}

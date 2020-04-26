import { Injectable, EventEmitter } from '@angular/core';
import { Plugins, GeolocationPosition } from '@capacitor/core';
import { SimpleCoordinates } from '../simple-coordinates';
import { AppStorageService } from './app-storage.service';
import { UserConfiguration } from '../user-configuration';
import { BackgroundGeolocation, BackgroundGeolocationEvents, BackgroundGeolocationResponse, BackgroundGeolocationLocationProvider, ServiceStatus } from '@ionic-native/background-geolocation/ngx';
import { GameRules } from '../game-rules';
import { AppConfiguration } from '../app-configuration';
import { PermissionsRequestResult } from '@capacitor/core/dist/esm/definitions';
import { Platform } from '@ionic/angular';

const { Geolocation } = Plugins;

@Injectable({
	providedIn: 'root'
})
/**
 * This exists because https://github.com/ionic-team/capacitor/issues/769
 * So we are using Capacitor when on web/pwa and the plugin when using a mobile
 * 
 */
export class GpsService {
	beacon = new EventEmitter<SimpleCoordinates>();
	running: boolean = false;
	isBrowser: boolean;
	watchCallbackName: string;

	/** Publish as static to avoid injecting to constructor. */
	static lastCoords: SimpleCoordinates;

	constructor(
		public appStorageSvc: AppStorageService,
		public backgroundGeolocation: BackgroundGeolocation,
		public platform: Platform
	) {
		this.appStorageSvc.update.subscribe((newConfig: UserConfiguration) => { this.setup() });
	}

	/**
	 * Backgroung Geolocation seems to only work under Android-iOS.
	 * Web/Electron can't run in background though.
	 */
	public async setup() {
		this.isBrowser = this.platform.is('desktop') || this.platform.is('electron');
		if (this.isBrowser) {
			this.setupBrowser();
		} else {
			this.setupMobile();
		}
	}

	public start() {
		if (!this.running) {
			console.info('Starting background geolocation.');
			if (this.isBrowser) {
				this.browserCallback();
				this.running = true;
			} else {
				this.backgroundGeolocation.checkStatus().then((status: ServiceStatus) => {
					if (!status.isRunning) {
						this.backgroundGeolocation.start().then(() => this.running = true);
					}
				});
			}
		}
	}

	public stop() {
		if (this.running) {
			console.info('Stopping background geolocation.');
			if (this.isBrowser) {
				Geolocation.clearWatch({ id: this.watchCallbackName }).then(() => this.running = false);
				this.running = false;
			} else {
				this.backgroundGeolocation.checkStatus().then((status: ServiceStatus) => {
					if (status.isRunning) {
						this.backgroundGeolocation.stop().then(() => this.running = false);
					}
				});
			}
		}
	}



	/**
	 * 
	 */
	public setupBrowser() {
		Geolocation.requestPermissions().then((result: PermissionsRequestResult) => {
			if (result) {
				console.info('Using Capcitor GPS.');
				this.canGetPosition().then(can => {
					if (can) {
						this.browserCallback();
					} else {
						this.browserCallback = null;
					}
				})
			}
		});
	}

	browserCallback() {
		this.watchCallbackName = Geolocation.watchPosition({ enableHighAccuracy: false, maximumAge: 0, timeout: AppConfiguration.GPS_CHECK_POSITION_TIMEOUT }, (pos: GeolocationPosition, err: any) => {
			if (err) {
				console.error(err);
			} else {
				if (this.running) {
					this.beacon.emit(new SimpleCoordinates(pos.coords.latitude, pos.coords.longitude));
				}
			}

		});
	}

	/**
	 * This plugin can auto allocate itself, see interval in the config.
	 */
	public setupMobile() {
		this.canGetPosition().then(can => {
			if (can) {
				this.backgroundGeolocation.configure({
					locationProvider: BackgroundGeolocationLocationProvider.RAW_PROVIDER,
					desiredAccuracy: 10,
					distanceFilter: 0,
					interval: AppConfiguration.GPS_CHECK_POSITION_BACKGROUND_TIMEOUT,
					fastestInterval: AppConfiguration.GPS_CHECK_POSITION_TIMEOUT,
					notificationsEnabled: true,
					notificationTitle: 'Background tracking',
					notificationText: 'enabled',
					debug: true
				});
				console.info('Using mobile GPS.')
				this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
					this.backgroundGeolocation.startTask().then((taskKey) => {
						this.beacon.emit(new SimpleCoordinates(location.latitude, location.longitude));
						this.backgroundGeolocation.endTask(taskKey);
					});
				});
			}
		});

	}

	/**
	 * 
	 */
	public canGetPosition(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			this.appStorageSvc.getConfiguration().then(async (config: UserConfiguration) => {
				// Get the newest position
				if (!config.geolocationEnabled || !config.home) { throw new Error('Geolocalization and/or home not enabled yet.') }
				if (config.home && GameRules.shouldAppBeRunning()) {
					return true;
				} else {
					return false;
				}
			}).catch((e) => {
				// No config, do not do anything as the geolocation might not be set.
				console.error(e);
			});
		});
	}

	/**
	 * Avoid using it as much as possible.
	 */
	static async getCurrentPosition(): Promise<SimpleCoordinates> {
		return Geolocation.getCurrentPosition().then((geoPos: GeolocationPosition) => {
			return new SimpleCoordinates(geoPos.coords.latitude, geoPos.coords.longitude);
		});
	}
}

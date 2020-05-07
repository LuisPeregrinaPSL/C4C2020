import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Don't remove ElementRef
import { Platform, NavController, ToastController, ModalController } from '@ionic/angular';
import { UserConfiguration } from 'src/app/user-configuration';
import { GpsService } from 'src/app/services/gps.service';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { Plugins } from '@capacitor/core';
import { AppConfiguration } from 'src/app/app-configuration';
import { CountdownComponent } from 'ngx-countdown';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { Constants } from 'src/app/constants';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ForestWatcherService } from 'src/app/services/forest-watcher.service';
import { ForestStatus } from 'src/app/forest-status.enum';
import { GameRules } from 'src/app/game-rules';
import { ConfettiUtil } from 'src/app/confetti-util';
import { ForestRenderer } from 'src/app/forest-renderer';
import { TranslateService } from '@ngx-translate/core';
import { WelcomePage } from 'src/app/modals/welcome/welcome.page';


const { Share } = Plugins;

@Component({
	selector: 'app-me',
	templateUrl: './me.page.html',
	styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit, AfterViewInit {
	config: UserConfiguration = new UserConfiguration();
	timeToGrowTree = AppConfiguration.TIME_TO_GROW_TREE / 1000;
	@ViewChild('countdown', { static: false }) countdown: CountdownComponent;
	countdownHack = false;
	@ViewChild('confetti', { static: false }) confetti: any;
	confettiUtil: ConfettiUtil;

	pageWidth: number;
	pageHeight: number;

	private fRenderer: ForestRenderer;

	iFrameDetection: any;

	constructor(
		public configService: AppStorageService,
		public screenshot: Screenshot,
		public restApi: RestApiService,
		public forestWatcher: ForestWatcherService,
		public platform: Platform,
		public navCtrl: NavController,
		public gpsService: GpsService,
		public translate: TranslateService,
		public toastController: ToastController,
		public modalCtrl: ModalController
	) {
		// If there is no configuration, go to welcome. No need for guards, that would add complexity for each time you opena new tab.
		this.configService.getConfiguration().catch(conf => this.showWelcome());

		configService.update.subscribe((config: UserConfiguration) => {
			this.config = config;

			if (config.geolocationEnabled && config.home) {
				this.countdown.begin();
			}
			if (config.trees > 1000) {
				this.configService.deleteConfiguration();
			}
		});

		/* forestWatcher.grow.subscribe((newTrees: number) => {
			this.updateConfig();
		}); */
		forestWatcher.shrink.subscribe(() => {
			this.countdown.stop();
		});
		forestWatcher.level.subscribe(() => {
			this.confettiUtil.fanfare();
		});

		// iFrame detection
		this.iFrameDetection = setInterval(() => {
			var elem = document.activeElement;
			if (elem && elem.tagName == 'IFRAME' && elem.id == 'vrWindow') {
				this.navCtrl.navigateForward('tabs/cities')
				clearInterval(this.iFrameDetection);
			}
		}, 100);
	}

	ngOnInit() {
		// These are required to get the actual window dimentions so canvas is not pixelated.
		this.pageWidth = this.platform.width();
		this.pageHeight = this.platform.height();

		var onVRMethod = async (e: any) => {
			console.log('Getting onVRLoaded on me');
			let count = await this.forestWatcher.getCount();
			this.fRenderer = new ForestRenderer(e.document, e.aframe, e.three);
			this.fRenderer.setCurrentView('gView');
			this.fRenderer.setLevel(await this.forestWatcher.getCurrentLevel());
			this.fRenderer.setTreeCount(count, false);

			window.removeEventListener('onVRLoaded', onVRMethod, false);
		};

		window.addEventListener('onVRLoaded', onVRMethod, false);

		this.forestWatcher.grow.subscribe(async () => {
			console.log('Listener Events.GROWING');
			let count = await this.forestWatcher.getCount();
			this.fRenderer.setTreeCount(count, true);
		});
		this.forestWatcher.level.subscribe((newLevel: number) => {
			console.log('New Level!!!');
			this.fRenderer.setLevel(newLevel);
		});
	}

	/**
	 * Restars the countdown and redraws forest. If we have a new tree, save the config.
	 */
	private async restartCountdown() {
		if (this.config) {
			if (
				this.countdown.left < 1 &&
				this.forestWatcher.status == ForestStatus.GROWING &&
				GameRules.isInForeground() &&
				GameRules.shouldAppBeRunning()
			) {
				// Get new tree count from right now.
				let newTrees = await this.forestWatcher.calculate(new Date());
				if (newTrees > 0) {
					console.log('Adding tree in foreground');
					this.countdown.restart();
					this.countdown.begin();
				}
			}
		}

		setTimeout(() => this.restartCountdown(), AppConfiguration.TIME_TO_GROW_TREE + 1000);
	}

	ngAfterViewInit() {
		this.confettiUtil = new ConfettiUtil(this.confetti.nativeElement)
		this.restartCountdown();

		setTimeout(() => { this.confettiUtil.standard() }, 500);
		setTimeout(() => { this.confettiUtil.standard() }, 1000);
		this.translate.get('HOME.WELCOME').subscribe(message => {
			this.toastController.create({
				message,
				duration: 2000
			}).then((toast: HTMLIonToastElement) => { toast.present() });
		})

	}

	public async shareOptions() {
		try {
			this.screenshot.URI(50).then(resolved => {
				this.restApi.uploadImage(this.config.deviceId, resolved.URI);
			});
		} catch (e) { }

		Share.share({
			title: 'Stay@home',
			text: 'I have ' + this.config.trees + ' trees in my forest. Can you beat my record?',
			url: Constants.SERVER + '?id=' + this.config.deviceId,
			dialogTitle: 'Share with buddies'
		});

	}

	public goToForestTab() {
		this.navCtrl.navigateForward('tabs/cities');
	}

	public isBrowser() {
		return this.platform.is('desktop');
	}

	public async showWelcome() {
		this.modalCtrl.create({
			component: WelcomePage
		}).then((modal: HTMLIonModalElement) => {
			modal.onDidDismiss().then(result => {
				//TODO: Actualizar conf?
			});
			modal.present();
		});
	}
}

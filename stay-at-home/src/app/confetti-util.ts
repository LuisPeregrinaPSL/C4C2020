import { Utils } from './utils';
import { AppConfiguration } from './app-configuration';

/**
 * Makes confetti!
 * 
 * @see {@link https://www.npmjs.com/package/canvas-confetti}
 */
export class ConfettiUtil {
    confettiElement: any;

    constructor(confettiElement: any) {
        this.confettiElement = confettiElement;
    }

    confetti(args: any) {
        return window['confetti'].apply(this, arguments);
    }

    standard() {
        this.confetti({
            angle: Utils.getRandomInt(60, 120),
            spread: Utils.getRandomInt(10, 200),
            particleCount: Utils.getRandomInt(100, 500)
        });
    }

    fanfare() {
        var end = Date.now() + (AppConfiguration.WELCOME_FANFARE_TIMEOUT);

        var colors = ['#bb0000', '#ffffff'];

        (
            function frame(confettiElement) {
                window['confetti']({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                window['confetti']({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }(this.confettiElement));

    }

    snow() {
        var duration = 15 * 1000;
        var animationEnd = Date.now() + duration;
        var skew = 1;

        (function frame() {
            var timeLeft = animationEnd - Date.now();
            var ticks = Math.max(200, 500 * (timeLeft / duration));
            skew = Math.max(0.8, skew - 0.001);

            this.confetti({
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    // since particles fall down, skew start toward the top
                    y: (Math.random() * skew) - 0.2
                },
                colors: ['#ffffff'],
                shapes: ['circle']
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());
    }
}

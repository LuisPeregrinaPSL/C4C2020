import { Animation, NavOptions, createAnimation } from '@ionic/core';

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';

export function fixAnimation(_: HTMLElement, navEl: TransitionOptions): Animation {

    let transitionElement: any = navEl;

    const enteringEl = transitionElement.enteringEl;
    const leavingEl = transitionElement.leavingEl;

    const backDirection = (transitionElement.direction === 'back');
    const rootTransition: Animation = createAnimation('')
    if (!backDirection) {

        const squareA: Animation = createAnimation('')
            .addElement(enteringEl)
            .duration(transitionElement.duration || DURATION)
            .easing(EASING)
            .beforeStyles({ 'opacity': 1 })
            .fromTo('transform', 'translateX(99.5%)', 'translateX(0%)');

        const squareB: Animation = createAnimation('')
            .addElement(leavingEl)
            .duration(transitionElement.duration || DURATION)
            .easing(EASING)
            .fromTo('transform', 'translateX(0%)', 'translateX(-20%)')
            .fromTo('opacity', '1', '0.8')

        rootTransition.addAnimation([squareA, squareB]);
    }
    else {

        const squareA: Animation = createAnimation('')
            .addElement(leavingEl)
            .duration(transitionElement.duration || DURATION)
            .easing(transitionElement.easing || EASING)
            .fromTo('transform', 'translateX(0%)', 'translateX(99.5%)');


        const squareB: Animation = createAnimation('')
            .addElement(enteringEl)
            .duration(transitionElement.duration || DURATION)
            .easing(transitionElement.easing || EASING)
            .fromTo('opacity', '0.8', '1')
            .fromTo('transform', 'translateX(-20%)', 'translateX(0%)');

        rootTransition.addAnimation([squareA, squareB]);

    }

    return rootTransition;

};

export interface TransitionOptions extends NavOptions {
    progressCallback?: ((ani: Animation | undefined) => void);
    baseEl: any;
    enteringEl: HTMLElement;
    leavingEl: HTMLElement | undefined;
}

export const getIonPageElement = (element: HTMLElement) => {
    if (element.classList.contains('ion-page')) {
        return element;
    }

    const ionPage = element.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs');
    if (ionPage) {
        return ionPage;
    }
    // idk, return the original element so at least something animates and we don't have a null pointer
    return element;
};
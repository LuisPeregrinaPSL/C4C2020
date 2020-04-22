import { AppConfiguration } from './app-configuration';
import { UserConfiguration } from './user-configuration';
import { Plugins, AppState } from '@capacitor/core';

const { App } = Plugins;
export class GameRules {
  /**
   * Used by calculateNewTrees.
   */
  static earliestGrowingDate: Date;
  static _isActive: boolean;

  static get isActive(){
    if (GameRules._isActive== undefined){
      App.addListener('appStateChange', (state: AppState) => {
        GameRules._isActive= state.isActive;
      });
      // Assume cold start
      return true;
    } else {
      return GameRules._isActive;
    }
    
  }


  /**
   * This should answer how many trees since the last time it was calculated.
   * If there are new trees, the earliestGrowingDate is 'now'.
   * Ideally this should only be called from ForestWatcherService
   * @param upTo Date to calculate since earliestGrowingDate
   */
  static calculateNewTrees(upTo: Date): number {
    GameRules.earliestGrowingDate = GameRules.earliestGrowingDate || upTo;
    let timeSpan = upTo.getTime() - GameRules.earliestGrowingDate.getTime();
    let newTrees = Math.floor(timeSpan / AppConfiguration.TIME_TO_GROW_TREE);
    if (newTrees > 0) {
      console.log('New trees: ' + newTrees);
      GameRules.earliestGrowingDate = new Date();
    }
    return newTrees
  }

  /**
   * Should this app be working in the background all day and all night?
   * We think it's better to not work during certain hours.
   */
  static shouldAppBeRunning(): boolean {
    let rightNow = new Date();
    return (rightNow > AppConfiguration.WORKING_HOURS.start && rightNow < AppConfiguration.WORKING_HOURS.end);
  }

  /**
   * Should return the current level. Here we decide what level is the user.
   */
  static getPlayerLevel(config: UserConfiguration) {
    let trees = config.trees;
    let level = 0;
    switch (true) {
      case trees >= 2000: level++;
      case trees >= 1000: level++;
      case trees >= 500: level++;
      case trees >= 200: level++;
      case trees >= 100: level++;
      case trees >= 50: level++;
      case trees >= 10: level++;
    }
    return level;
  }
};
import { AppConfiguration } from './app-configuration';
import { UserConfiguration } from './user-configuration';
import { Plugins, AppState } from '@capacitor/core';

const { App } = Plugins;
export class GameRules {
  /**
   * Used by calculateNewTrees.
   */
  static earliestGrowingDate: Date = new Date();
  static _inForeground: boolean;
  static isActive: boolean = true;

  static isInForeground() {
    if (GameRules._inForeground == undefined) {
      App.addListener('appStateChange', (state: AppState) => {
        GameRules._inForeground = state.isActive;
      });
      // Assume cold start
      return true;
    } else {
      return GameRules._inForeground;
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
    return (rightNow > AppConfiguration.WORKING_HOURS.start && rightNow < AppConfiguration.WORKING_HOURS.end && this.isActive);
  }

  /**
   * Should return the current level. Here we decide what level is the user.
   */
  static getPlayerLevel(config: UserConfiguration) {
    let trees = config.trees;
    let level = 0;
    switch (true) {
      case trees >= 1280: level++;
      case trees >= 640: level++;
      case trees >= 320: level++;
      case trees >= 160: level++;
      case trees >= 80: level++;
      case trees >= 40: level++;
      case trees >= 20: level++;
      case trees >= 10: level++;
    }
    return level;
  }
  /**
  * Should return the number of trees at a particular level.
  */
  static getTreesByLevel(level: number) {
    let treeNumber = 0;
    switch (true) {
      case level == 8: treeNumber += 1280; break;
      case level == 7: treeNumber += 640; break;
      case level == 6: treeNumber += 320; break;
      case level == 5: treeNumber += 160; break;
      case level == 4: treeNumber += 80; break;
      case level == 3: treeNumber += 40; break;
      case level == 2: treeNumber += 20; break;
      case level == 1: treeNumber += 10; break;
    }
    return treeNumber;
  }

  /**
   * We have to decide if we send it or not based on certain rules.
   * As of today we will not care if its growing or shrinking.
   * 
   * @param growing we may change stance if its not growing.
   */
  static shouldSendPosition(growing: boolean) {
    return true;
  }
};
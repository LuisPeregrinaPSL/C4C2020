import { Injectable } from '@angular/core';
import { AppConfiguration } from '../app-configuration';
import { UserConfiguration } from '../user-configuration';

@Injectable({
  providedIn: 'root'
})
export class GameRulesService {
  earliestGrowingDate: Date;

  constructor() { }

  /**
   * This should answer how many trees since the last time it was calculated.
   * If there are new trees, the earliestGrowingDate is now.
   * @param upTo Date to calculate since earliestGrowingDate
   */
  public calculateNewTrees(upTo: Date): number {
    this.earliestGrowingDate = this.earliestGrowingDate || upTo;
    let timeSpan = upTo.getTime() - this.earliestGrowingDate.getTime();
    console.log('Difference: ' + timeSpan);
    let newTrees = Math.floor(timeSpan / AppConfiguration.TIME_TO_GROW_TREE);
    if (newTrees > 0) {
      console.log('New trees: ' + newTrees);
      this.earliestGrowingDate = new Date();
    }
    return newTrees
  }

  /**
   * Should this app be working in the background all day and all night?
   * We think it's better to not work during certain hours.
   */
  public shouldAppBeRunning(): boolean {
    let rightNow = new Date();
    return (rightNow > AppConfiguration.WORKING_HOURS.start && rightNow < AppConfiguration.WORKING_HOURS.end);
  }

  /**
   * Should return the current level. Here we decide what level is the user.
   */
  public getPlayerLevel(config: UserConfiguration) {
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
}

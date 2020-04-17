import { Injectable } from '@angular/core';
import { AppConfiguration } from '../app-configuration';

@Injectable({
  providedIn: 'root'
})
export class TreeCalculatorService {
  earliestGrowingDate: Date;

  constructor() { }

  /**
   * This should answer how many trees since the last time it was calculated.
   * If there are new trees, the earliestGrowingDate is now.
   * @param upTo Date to calculate since earliestGrowingDate
   */
  public calculate(upTo: Date): number {
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
}

import { Injectable } from '@angular/core';

interface USERS {
  rating: number;
  category: string;
  comment: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  
  constructor() { }


  //---------------------------- NON essentials --------------------------------

  public mixLists(listA: string[], listB: string[]): string[] {
    const minLength = Math.min(listA.length, listB.length);
  
    const mixedList = Array.from({ length: minLength })
      .map((_, i) => `${listA[i]} / ${listB[i]}`)
      .reduce((acc, mixedValue) => {
        acc.push(mixedValue);
        return acc;
      }, [] as string[]);
  
    const remainingA = listA.slice(minLength).map(value => `${value} / -`);
    const remainingB = listB.slice(minLength).map(value => `- / ${value}`);
  
    return mixedList.concat(remainingA, remainingB);
  }
  

  public getLabelForDataset(list: string[]): string {
    return list[0] + ' to ' + list.pop();
  }

  // Helper function to get ISO week number
  public getISOWeek(date: Date): number {
    const dt = new Date(date);
    dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7));
    const yearStart = new Date(dt.getFullYear(), 0, 1);
    return Math.ceil(((dt.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  public getLabelForChart(timeUnit: 'day' | 'week' | 'month' | 'year', firstList: string[], secondList: string[]): string[] {
    return ['From ' + firstList[0] + ' to ' + firstList.pop() + ' | ' + 'From ' + secondList[0] + ' to ' + secondList.pop()];
  }

  public incrementDate(date: Date, timeUnit: 'day' | 'week' | 'month' | 'year'): void {
    switch (timeUnit) {
        case 'day':
            date.setDate(date.getDate() + 1);
            break;
        case 'week':
            date.setDate(date.getDate() + 7);
            break;
        case 'month':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'year':
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
  }


}

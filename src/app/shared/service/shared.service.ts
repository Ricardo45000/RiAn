import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  

  private filterRatingSubject = new Subject<number>();
  private filterCategorySubject = new Subject<string>();

  filterRating$ = this.filterRatingSubject.asObservable();
  filterCategory$ = this.filterCategorySubject.asObservable();

  sendFilterRating(rating: number) {
    this.filterRatingSubject.next(rating);
  }

  sendFilterCategory(category: string) {
    this.filterCategorySubject.next(category);
  }

}

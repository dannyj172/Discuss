import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const RECENT_KEY = 'Recent';

@Injectable({
  providedIn: 'root',
})
export class RecentService {
  private recentSubject = new BehaviorSubject(this.getRecentFromLocalStorage());
  public recentObservable: Observable<any>;

  constructor() {
    this.recentObservable = this.recentSubject.asObservable();
  }

  setRecentToLocalStorage(topic: string) {
    let recent = this.getRecentFromLocalStorage();

    if (recent.includes(topic)) {
      recent.splice(recent.indexOf(topic), 1);
      recent.unshift(topic);
    } else if (recent.length < 3) {
      recent.unshift(topic);
    } else if (recent.length >= 3) {
      recent.splice(2);
      recent.unshift(topic);
    }

    this.recentSubject.next(recent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  }

  getRecentFromLocalStorage(): any {
    const recentJson = localStorage.getItem(RECENT_KEY);

    if (recentJson) return JSON.parse(recentJson);
    return [];
  }

  removeRecentFromLocalStorage() {
    localStorage.setItem(RECENT_KEY, JSON.stringify([]));
  }
}

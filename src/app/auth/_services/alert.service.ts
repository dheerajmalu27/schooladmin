import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable()
export class AlertService {
  private subject = new BehaviorSubject<any>(null); // Initialized to `null` or another default value
  private keepAfterNavigationChange = false;

  constructor(private _router: Router) {
    // clear alert message on route change
    this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next(null);
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'danger', text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderToFooterService {
    private booleanSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Observable stream
  data$ = this.booleanSubject.asObservable();

  // Emit new data
  sendData(data: any) {
    this.booleanSubject.next(data);
  }
}
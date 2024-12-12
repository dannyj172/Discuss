import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TimeFormatService {
  constructor() {}

  timeFormat(time: string): any {
    const formattedTime = moment(new Date(time).getTime()).fromNow();
    return formattedTime;
  }
}

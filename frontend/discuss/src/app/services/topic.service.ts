import { Injectable } from '@angular/core';
import { Topic } from '../shared/models/Topic';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOPIC_BY_TOPICNAME_URL, TOPICS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Topic[]> {
    return this.http.get<Topic[]>(TOPICS_URL);
  }

  getTopicByName(topicName: string): Observable<Topic> {
    return this.http.get<Topic>(TOPIC_BY_TOPICNAME_URL + topicName);
  }
}

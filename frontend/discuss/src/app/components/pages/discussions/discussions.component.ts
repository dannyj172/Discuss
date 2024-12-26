import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/shared/models/Topic';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css'],
})
export class DiscussionsComponent {
  topics!: Topic[];
  constructor(topicService: TopicService) {
    topicService
      .getAll()
      .pipe(map((topics) => topics.sort(this.sortByPostsByAmount)))
      .subscribe((serverTopics) => {
        this.topics = serverTopics;
      });
  }

  sortByPostsByAmount(a: Topic, b: Topic) {
    return a.postsAmount < b.postsAmount ? 1 : -1;
  }
}

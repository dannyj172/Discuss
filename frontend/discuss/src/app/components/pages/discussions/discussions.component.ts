import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/shared/models/Topic';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css'],
})
export class DiscussionsComponent implements OnInit {
  topics!: Topic[];
  constructor(private topicService: TopicService) {
    topicService.getAll().subscribe((serverTopics) => {
      this.topics = serverTopics;
    });
  }

  ngOnInit(): void {}
}

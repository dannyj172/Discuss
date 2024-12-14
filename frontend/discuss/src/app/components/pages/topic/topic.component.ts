import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { TimeFormatService } from 'src/app/services/timeformat.service';
import { TopicService } from 'src/app/services/topic.service';
import { Post } from 'src/app/shared/models/Post';
import { Topic } from 'src/app/shared/models/Topic';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css'],
})
export class TopicComponent implements OnInit {
  topic: Topic = { id: '', topicName: '...', banner: '', postsAmount: 0 };
  posts: Post[] = [];

  constructor(
    activatedRoute: ActivatedRoute,
    private topicService: TopicService,
    private postService: PostService,
    private router: Router,
    private timeFormatService: TimeFormatService
  ) {
    let topicObservable: Observable<Topic>;
    let postsObservable: Observable<Post[]>;
    activatedRoute.params.subscribe((params) => {
      if (params['topicName']) {
        topicObservable = this.topicService.getTopicByName(params['topicName']);
        postsObservable = this.postService.getAllPostsByTopicName(
          params['topicName']
        );
      }
      topicObservable.subscribe((serverTopic) => {
        this.topic = serverTopic;
      });
      postsObservable.subscribe((serverPosts) => {
        this.posts = serverPosts;
      });
    });
  }

  ngOnInit(): void {}

  onCreatePostButtonClick(topic: string) {
    this.router.navigate(['/create-post'], {
      queryParams: { setTopic: topic },
    });
  }

  timeFormat(time: string) {
    return this.timeFormatService.timeFormat(time);
  }
}

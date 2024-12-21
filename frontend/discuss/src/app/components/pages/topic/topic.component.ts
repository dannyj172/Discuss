import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { iif, Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';
import { RecentService } from 'src/app/services/recent.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/shared/models/Post';
import { Topic } from 'src/app/shared/models/Topic';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css'],
})
export class TopicComponent {
  topic: Topic = { id: '', topicName: '...', banner: '', postsAmount: 0 };
  posts: Post[] = [];
  postsObservable!: Observable<Post[]>;
  currentUser!: User;
  isLoading: boolean = false;

  constructor(
    activatedRoute: ActivatedRoute,
    private topicService: TopicService,
    private postService: PostService,
    private userService: UserService,
    private toastrService: ToastrService,
    private recentService: RecentService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    let topicObservable: Observable<Topic>;
    this.currentUser = userService.currentUser;
    activatedRoute.params.subscribe((params) => {
      if (params['topicName']) {
        topicObservable = this.topicService.getTopicByName(params['topicName']);
        this.postsObservable = this.postService.getAllPostsByTopicName(
          params['topicName']
        );
        if (this.currentUser.token) {
          recentService.setRecentToLocalStorage(params['topicName']);
        }
      }
      topicObservable.subscribe((serverTopic) => {
        this.topic = serverTopic;
      });
      this.postsObservable.subscribe((serverPosts) => {
        this.posts = serverPosts;
        this.loadingService.isLoading.subscribe(() => {
          this.isLoading = false;
        });
      });
    });
  }

  onCreatePostButtonClick(topic: string) {
    this.router.navigate(['/create-post'], {
      queryParams: { setTopic: topic },
    });
  }

  upvoteClick(postId: string) {
    this.postService.upvote(postId, this.currentUser.id).subscribe({
      next: () => {
        this.postsObservable.subscribe((serverPosts) => {
          this.posts = serverPosts;
        });
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Unable to vote!');
      },
    });
  }

  downvoteClick(postId: string) {
    this.postService.downvote(postId, this.currentUser.id).subscribe({
      next: () => {
        this.postsObservable.subscribe((serverPosts) => {
          this.posts = serverPosts;
        });
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Unable to vote!');
      },
    });
  }
}

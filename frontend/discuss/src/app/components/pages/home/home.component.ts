import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { TimeFormatService } from 'src/app/services/timeformat.service';
import { Post } from 'src/app/shared/models/Post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  posts: Post[] = [];

  constructor(
    private postService: PostService,
    private timeFormatService: TimeFormatService,
    activatedRoute: ActivatedRoute
  ) {
    let postsObservable: Observable<Post[]>;
    activatedRoute.params.subscribe((params) => {
      if (params['searchTerm']) {
        postsObservable = this.postService.getAllPostsBySearchTerm(
          params['searchTerm']
        );
      } else {
        postsObservable = postService.getAll();
      }

      postsObservable.subscribe((serverPosts) => {
        this.posts = serverPosts; //posts.reverse when sorting from newest to oldest
      });
    });
  }

  timeFormat(time: string) {
    return this.timeFormatService.timeFormat(time);
  }
}

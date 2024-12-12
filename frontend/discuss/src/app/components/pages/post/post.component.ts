import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { TimeFormatService } from 'src/app/services/timeformat.service';
import { Post } from 'src/app/shared/models/Post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  showOptions: boolean = false;
  post!: Post;

  constructor(
    activatedRoute: ActivatedRoute,
    private postService: PostService,
    private timeFormatService: TimeFormatService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params['id'])
        postService.getPostById(params['id']).subscribe((serverPost) => {
          this.post = serverPost;
        });
    });
  }

  optionsClick() {
    this.showOptions = !this.showOptions;
  }

  timeFormat(time: string) {
    return this.timeFormatService.timeFormat(time);
  }
}

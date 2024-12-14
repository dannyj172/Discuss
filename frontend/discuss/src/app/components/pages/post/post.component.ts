import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/services/post.service';
import { TimeFormatService } from 'src/app/services/timeformat.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/shared/models/Post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  isPostOwner: boolean = false;
  showOptions: boolean = false;
  post: Post = {
    id: '',
    user: '',
    owner: '...',
    topic: '...',
    createdAt: '...',
    title: '...',
    votes: 0,
    comments: [],
    upvoters: [],
    downvoters: [],
  };

  showPopup: boolean = false;
  confirmationTitle!: string;
  confirmationText!: string;
  confirmationCancelButtonText!: string;
  confirmationConfirmButtonText!: string;

  constructor(
    activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private location: Location,
    private timeFormatService: TimeFormatService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params['id'])
        postService.getPostById(params['id']).subscribe((serverPost) => {
          this.post = serverPost;
          if (userService.currentUser.id === this.post.user) {
            this.isPostOwner = true;
          }
        });
    });
  }

  onConfirmationPopup(action: string) {
    this.showPopup = true;
    if (action == 'del') {
      this.confirmationTitle = 'Delete Post?';
      this.confirmationText =
        "Once you delete this post, it can't be restored.";
      this.confirmationCancelButtonText = 'Go Back';
      this.confirmationConfirmButtonText = 'Yes, Delete';
    }
  }

  onPopupConfirm($event: string) {
    if ($event === 'delete') {
      this.postService.deletePost(this.post.id).subscribe({
        next: () => {
          // lower posts count for topic
          this.router.navigateByUrl('/');
          this.toastrService.success('Post has been deleted.', 'Success!');
        },
        error: (errorResponse) => {
          console.log(errorResponse.error);
          this.toastrService.error(errorResponse.error, 'Oops!');
        },
      });
    }
  }

  onBackClick() {
    this.location.back();
  }

  optionsClick() {
    this.showOptions = !this.showOptions;
  }

  timeFormat(time: string) {
    return this.timeFormatService.timeFormat(time);
  }
}

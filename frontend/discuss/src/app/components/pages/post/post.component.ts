import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/shared/models/Post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  isLoading: boolean = false;
  isFullscreen: boolean = false;
  isPostOwner: boolean = false;
  showOptions: boolean = false;
  isCommenting: boolean = false;

  // commentForm

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
    private topicService: TopicService,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private location: Location,
    loadingService: LoadingService
  ) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

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

  onImageClick() {
    this.isFullscreen = true;
  }

  closeFullscreen() {
    this.isFullscreen = false;
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
          this.topicService
            .changePostAmount(this.post.topic, 'decrease')
            .subscribe(() => {
              this.router.navigateByUrl('/');
              this.toastrService.success('Post has been deleted.', 'Success!');
            });
        },
        error: (errorResponse) => {
          console.log(errorResponse.error);
          this.toastrService.error(errorResponse.error, 'Oops!');
        },
      });
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  onBackClick() {
    this.location.back();
  }

  optionsClick() {
    this.showOptions = !this.showOptions;
  }
}

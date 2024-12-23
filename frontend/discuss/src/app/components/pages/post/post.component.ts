import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/app/shared/models/Comment';
import { Post } from 'src/app/shared/models/Post';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  commentForm!: FormGroup;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  isFullscreen: boolean = false;
  isPostOwner: boolean = false;
  showOptions: boolean = false;
  isCommenting: boolean = false;
  currentUser!: User;
  commentId: string = '';

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
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    loadingService: LoadingService
  ) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.currentUser = userService.currentUser;

    this.commentForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.maxLength(10000)]],
    });

    activatedRoute.params.subscribe((params) => {
      if (params['id'])
        postService.getPostById(params['id']).subscribe({
          next: (serverPost) => {
            this.post = serverPost;
            if (this.currentUser.id === this.post.user) {
              this.isPostOwner = true;
            }
          },
          error: (errorResponse) => {
            console.log(errorResponse);
            router.navigateByUrl('/');
            this.toastrService.error(errorResponse.error, 'Invalid post!');
          },
        });
    });
  }

  get fc() {
    return this.commentForm.controls;
  }

  cancel() {
    this.commentForm.patchValue({ text: '' });
    this.isCommenting = false;
  }

  submit() {
    this.isSubmitted = true;
    if (this.commentForm.invalid) return;

    const fv = this.commentForm.value;

    let comment: Comment = {
      text: fv.text,
      author: this.currentUser.username,
      ownerId: this.currentUser.id,
      createdAt: '',
      id: '',
    };

    this.postService.comment(this.post.id, comment).subscribe((post) => {
      this.postService.getPostById(post.id).subscribe((serverPost) => {
        this.post = serverPost;
        this.cancel();
        this.isSubmitted = false;
      });
    });
  }

  setCommentDeleteId(commentId: string) {
    this.commentId = commentId;
  }

  onImageClick() {
    this.isFullscreen = true;
  }

  closeFullscreen() {
    this.isFullscreen = false;
  }

  onConfirmationPopup(action: string) {
    if (action == 'delete post') {
      this.confirmationTitle = 'Delete Post?';
      this.confirmationText =
        "Once you delete this post, it can't be restored.";
      this.confirmationCancelButtonText = 'Go Back';
      this.confirmationConfirmButtonText = 'Yes, Delete';
    } else if (action == 'delete comment') {
      this.confirmationTitle = 'Delete Comment?';
      this.confirmationText =
        "Are you sure you want to delete your comment? You can't undo this.";
      this.confirmationCancelButtonText = 'Cancel';
      this.confirmationConfirmButtonText = 'Delete';
    } else if (action == 'cancel comment') {
      this.confirmationTitle = 'Discard comment?';
      this.confirmationText =
        'You have a comment in progress, are you sure you want to discard it?';
      this.confirmationCancelButtonText = 'Cancel';
      this.confirmationConfirmButtonText = 'Discard';
    }
    this.showPopup = true;
  }

  onPopupConfirm($event: string) {
    if ($event === 'delete post') {
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
    } else if ($event === 'discard comment') {
      this.isSubmitted = false;
      this.cancel();
    } else if ($event === 'delete comment') {
      this.postService.deleteComment(this.post.id, this.commentId).subscribe({
        next: () => {
          this.postService.getPostById(this.post.id).subscribe((serverPost) => {
            this.post = serverPost;
          });
        },
        error: (errorResponse) => {
          console.log(errorResponse.error);
          this.toastrService.error(
            errorResponse.error,
            'Unable to delete comment!'
          );
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

  upvoteClick(postId: string) {
    this.postService.upvote(postId, this.currentUser.id).subscribe({
      next: () => {
        this.postService.getPostById(this.post.id).subscribe((serverPost) => {
          this.post = serverPost;
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
        this.postService.getPostById(this.post.id).subscribe((serverPost) => {
          this.post = serverPost;
        });
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Unable to vote!');
      },
    });
  }
}

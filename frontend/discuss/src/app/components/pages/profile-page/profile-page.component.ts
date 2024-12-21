import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { IProfileDetails } from 'src/app/shared/interfaces/IProfileDetails';
import { Post } from 'src/app/shared/models/Post';
import { Topic } from 'src/app/shared/models/Topic';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent {
  posts: Post[] = [];
  postsObservable!: Observable<Post[]>;
  currentUser!: User;
  isLoading: boolean = false;
  profileDetails: IProfileDetails = { createdAt: '...', username: '...' };
  showSortOptions: boolean = false;
  currentSortOption: string = 'New';

  constructor(
    activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private toastrService: ToastrService,
    loadingService: LoadingService,
    private router: Router
  ) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.currentUser = userService.currentUser;
    activatedRoute.params.subscribe((params) => {
      if (params['username']) {
        this.postsObservable = this.postService.getAllPostsByUser(
          params['username']
        );
        this.userService
          .getUserDetails(params['username'])
          .subscribe((user) => {
            this.profileDetails = user;
            this.profileDetails.createdAt = moment(
              this.profileDetails.createdAt
            ).format('DD/MM/YYYY');
          });
      }
      this.postsObservable.subscribe((serverPosts) => {
        this.posts = serverPosts;
        loadingService.isLoading.subscribe(() => {
          this.isLoading = false;
        });
      });
    });
  }

  onSortClick() {
    this.showSortOptions = !this.showSortOptions;
  }

  onSortChange(sortBy: string) {
    if (sortBy === 'New' && this.currentSortOption !== 'New') {
      this.postsObservable.subscribe((serverPosts) => {
        this.currentSortOption = 'New';
        this.posts = serverPosts;
      });
    } else if (sortBy === 'Old' && this.currentSortOption !== 'Old') {
      this.currentSortOption = 'Old';
      this.postsObservable.subscribe((serverPosts) => {
        this.posts = serverPosts.slice().reverse();
      });
    }
    this.showSortOptions = !this.showSortOptions;
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

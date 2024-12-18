import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/shared/models/Post';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  posts: Post[] = [];
  isLoading: boolean = false;
  showSortOptions: boolean = false;
  currentUser!: User;
  currentSortOption: string = 'New';

  constructor(
    private postService: PostService,
    private userService: UserService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    loadingService: LoadingService
  ) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.currentUser = userService.currentUser;

    this.getPosts();
  }

  getPosts() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['searchTerm']) {
        this.postService
          .getAllPostsBySearchTerm(params['searchTerm'])
          .subscribe((serverPosts) => {
            if (this.currentSortOption === 'Old') {
              this.posts = serverPosts.slice().reverse();
            } else {
              this.posts = serverPosts;
            }
          });
      } else {
        this.postService.getAll().subscribe((serverPosts) => {
          if (this.currentSortOption === 'Old') {
            this.posts = serverPosts.slice().reverse();
          } else {
            this.posts = serverPosts;
          }
          console.log(this.posts);
        });
      }
    });
  }

  onSortClick() {
    this.showSortOptions = !this.showSortOptions;
  }

  onSortChange(sortBy: string) {
    if (sortBy === 'New' && this.currentSortOption !== 'New') {
      this.currentSortOption = 'New';
      this.getPosts();
    } else if (sortBy === 'Old' && this.currentSortOption !== 'Old') {
      this.currentSortOption = 'Old';
      this.getPosts();
    }
    this.showSortOptions = !this.showSortOptions;
  }

  upvoteClick(postId: string) {
    this.postService.upvote(postId, this.currentUser.id).subscribe({
      next: () => {
        this.getPosts();
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Unable to vote!');
      },
    });
  }

  downvoteClick(postId: string) {
    this.postService.downvote(postId, this.currentUser.id).subscribe({
      next: () => {
        this.getPosts();
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Unable to vote!');
      },
    });
  }
}

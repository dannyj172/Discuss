import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/shared/models/Post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  posts: Post[] = [];
  isLoading: boolean = false;
  showSortOptions: boolean = false;
  currentSortOption: string = 'New';

  constructor(
    private postService: PostService,
    loadingService: LoadingService,
    private activatedRoute: ActivatedRoute
  ) {
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

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
}

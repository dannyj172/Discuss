import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/shared/models/Post';
import { Topic } from 'src/app/shared/models/Topic';
import { User } from 'src/app/shared/models/User';
import { imageValidator } from 'src/app/shared/validators/image-validator';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
})
export class EditPostComponent {
  editForm!: FormGroup;
  isSubmitted: boolean = false;
  postType: string = 'text';
  topics!: Topic[];
  currentUser!: User;
  post!: Post;

  constructor(
    activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private topicService: TopicService,
    private postService: PostService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.currentUser = userService.currentUser;
    this.editForm = this.formBuilder.group({
      topic: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, imageValidator()]],
    });

    activatedRoute.params.subscribe((params) => {
      if (params['id'])
        postService.getPostById(params['id']).subscribe((serverPost) => {
          this.post = serverPost;
          if (this.post.imageUrl && this.post.description) {
            this.postType = 'text-image';
            this.editForm.patchValue({
              topic: this.post.topic,
              title: this.post.title,
              description: this.post.description,
              imageUrl: this.post.imageUrl,
            });
          } else if (!this.post.imageUrl) {
            this.postType = 'text';
            this.editForm.removeControl('imageUrl');
            this.editForm.patchValue({
              topic: this.post.topic,
              title: this.post.title,
              description: this.post.description,
            });
          } else if (!this.post.description) {
            this.postType = 'image';
            this.editForm.removeControl('description');
            this.editForm.patchValue({
              topic: this.post.topic,
              title: this.post.title,
              imageUrl: this.post.imageUrl,
            });
          }
        });
    });

    topicService.getAll().subscribe((serverTopics) => {
      this.topics = serverTopics;
      this.editForm.patchValue({ topic: this.post.topic });
    });
  }

  get fc() {
    return this.editForm.controls;
  }

  changePostType(postType: string) {
    if (postType == 'text-image') {
      this.postType = 'text-image';
      if (!this.editForm.controls['imageUrl']) {
        this.editForm.addControl(
          'imageUrl',
          new FormControl('', [Validators.required, imageValidator()])
        );
      }
      if (!this.editForm.controls['description']) {
        this.editForm.addControl(
          'description',
          new FormControl('', Validators.required)
        );
      }
    } else if (postType == 'text') {
      this.postType = 'text';
      if (this.editForm.controls['imageUrl']) {
        this.editForm.removeControl('imageUrl');
      }
      if (!this.editForm.controls['description']) {
        this.editForm.addControl(
          'description',
          new FormControl('', Validators.required)
        );
      }
    } else if (postType == 'image') {
      this.postType = 'image';
      if (this.editForm.controls['description']) {
        this.editForm.removeControl('description');
      }
      if (!this.editForm.controls['imageUrl']) {
        this.editForm.addControl(
          'imageUrl',
          new FormControl('', [Validators.required, imageValidator()])
        );
      }
    }
  }

  submit() {
    this.isSubmitted = true;
    if (this.editForm.invalid) return;

    const fv = this.editForm.value;

    let post: any = {
      topic: fv.topic,
      title: fv.title,
      imageUrl: '',
      description: '',
    };

    if (fv.imageUrl) {
      post.imageUrl = fv.imageUrl;
    }
    if (fv.description) {
      post.description = fv.description;
    }

    this.postService.editPost(post, this.post.id).subscribe({
      next: (post) => {
        this.router.navigateByUrl(`/posts/${post.id}`);
      },
      error: (errorResponse) => {
        this.router.navigateByUrl(`/posts/${this.post.id}`);
        console.log(errorResponse.error);
        this.toastrService.error(errorResponse.error, 'Edit failed');
      },
    });
  }
}

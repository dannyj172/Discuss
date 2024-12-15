import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { Topic } from 'src/app/shared/models/Topic';
import { User } from 'src/app/shared/models/User';
import { imageValidator } from 'src/app/shared/validators/image-validator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  createForm!: FormGroup;
  isSubmitted: boolean = false;
  postType: string = 'text';
  topics!: Topic[];
  currentUser!: User;
  setTopic: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private topicService: TopicService,
    private postService: PostService,
    private router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.currentUser = userService.currentUser;
    this.createForm = this.formBuilder.group({
      topic: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, imageValidator()]],
    });
    this.createForm.removeControl('imageUrl');

    activatedRoute.queryParams.subscribe((params) => {
      if (params['setTopic']) {
        this.setTopic = params['setTopic'];
      }
    });

    topicService.getAll().subscribe((serverTopics) => {
      this.topics = serverTopics;
      if (this.setTopic) {
        this.createForm.patchValue({ topic: this.setTopic });
      } else {
        this.createForm.patchValue({ topic: this.topics[0].topicName });
      }
    });
  }

  get fc() {
    return this.createForm.controls;
  }

  changePostType(postType: string) {
    if (postType == 'text-image') {
      this.postType = 'text-image';
      if (!this.createForm.controls['imageUrl']) {
        this.createForm.addControl(
          'imageUrl',
          new FormControl('', [Validators.required, imageValidator()])
        );
      }
      if (!this.createForm.controls['description']) {
        this.createForm.addControl(
          'description',
          new FormControl('', Validators.required)
        );
      }
    } else if (postType == 'text') {
      this.postType = 'text';
      if (this.createForm.controls['imageUrl']) {
        this.createForm.removeControl('imageUrl');
      }
      if (!this.createForm.controls['description']) {
        this.createForm.addControl(
          'description',
          new FormControl('', Validators.required)
        );
      }
    } else if (postType == 'image') {
      this.postType = 'image';
      if (this.createForm.controls['description']) {
        this.createForm.removeControl('description');
      }
      if (!this.createForm.controls['imageUrl']) {
        this.createForm.addControl(
          'imageUrl',
          new FormControl('', [Validators.required, imageValidator()])
        );
      }
    }
  }

  submit() {
    this.isSubmitted = true;
    if (this.createForm.invalid) return;

    const fv = this.createForm.value;

    let post: any = {
      topic: fv.topic,
      title: fv.title,
      owner: this.currentUser.username,
      id: '',
      user: this.currentUser.id,
    };

    if (fv.imageUrl) {
      post.imageUrl = fv.imageUrl;
    }
    if (fv.description) {
      post.description = fv.description;
    }
    this.postService.createPost(post).subscribe((post) => {
      this.topicService
        .changePostAmount(post.topic, 'increase')
        .subscribe(() => {
          this.router.navigateByUrl(`/posts/${post.id}`);
        });
    });
  }
}

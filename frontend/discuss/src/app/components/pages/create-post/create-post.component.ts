import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { Topic } from 'src/app/shared/models/Topic';
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

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private topicService: TopicService,
    private router: Router
  ) {
    this.createForm = this.formBuilder.group({
      topic: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, imageValidator()]],
    });
    this.createForm.removeControl('imageUrl');

    topicService.getAll().subscribe((serverTopics) => {
      this.topics = serverTopics;
      this.createForm.patchValue({ topic: this.topics[1].topicName });
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

    if (!fv.imageUrl && !fv.description) return;

    let post: any = {
      topic: fv.topic,
      title: fv.title,
    };

    if (fv.imageUrl) {
      post.imageUrl = fv.imageUrl;
    }
    if (fv.description) {
      post.description = fv.description;
    }

    console.log(post);
    // service
  }
}

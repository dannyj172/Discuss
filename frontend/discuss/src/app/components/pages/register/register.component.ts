import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted: boolean = false;

  returnUrl = '';
  commentText?: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: PasswordsMatchValidator('password', 'confirmPassword') }
    );

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
    this.commentText =
      this.activatedRoute.snapshot.queryParams['commentText'] || undefined;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;

    const fv = this.registerForm.value;
    const user: IUserRegister = {
      username: fv.username,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
    };

    this.userService.register(user).subscribe((_) => {
      if (this.commentText) {
        this.router.navigate([this.returnUrl], {
          queryParams: { commentText: this.commentText },
        });
      } else {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
}

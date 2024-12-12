import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  showOptions: boolean = false;
  user!: User;

  searchForm = this.formBuilder.group({
    search: ['', [Validators.required]],
  });
  searchTerm = '';

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params['searchTerm']) this.searchTerm = params['searchTerm'];
    });

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  search(): void {
    if (this.searchForm.invalid) return;
    const { search } = this.searchForm.value;
    this.router.navigateByUrl('search/' + search);
  }

  optionsClick() {
    this.showOptions = !this.showOptions;
  }

  logout() {
    this.userService.logout();
  }

  get isAuth() {
    return this.user.id;
  }
}

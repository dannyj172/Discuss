import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecentService } from 'src/app/services/recent.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  resourcesOpen = false;
  recentOpen = false;
  recent!: string[];
  currentUser!: User;

  constructor(
    public router: Router,
    recentService: RecentService,
    userService: UserService
  ) {
    this.currentUser = userService.currentUser;
    recentService.recentObservable.subscribe((newRecent) => {
      this.recent = newRecent;
    });
  }

  openResources(): void {
    this.resourcesOpen = !this.resourcesOpen;
  }

  openRecent(): void {
    this.recentOpen = !this.recentOpen;
  }
}

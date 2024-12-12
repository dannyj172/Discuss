import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  resourcesOpen = false;
  recentOpen = false;

  constructor(public router: Router) {}

  openResources(): void {
    this.resourcesOpen = !this.resourcesOpen;
  }

  openRecent(): void {
    this.recentOpen = !this.recentOpen;
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type MenuItem = {
  label: string;
  path: string;
  iconClass: string; // bootstrap icon class
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() collapsed = false;

  topItems: MenuItem[] = [
    { label: 'New Email', path: '/compose', iconClass: 'bi-plus' },
    { label: 'Inbox', path: '/inbox', iconClass: 'bi-inbox' },
    { label: 'Sent', path: '/sent', iconClass: 'bi-send' },
    { label: 'Drafts', path: '/drafts', iconClass: 'bi-file-earmark-text' },
    { label: 'Trash', path: '/trash', iconClass: 'bi-trash' },
  ];

  bottomItems: MenuItem[] = [
    { label: 'Logout', path: '/login', iconClass: 'bi-box-arrow-in-right' },
  ];
}

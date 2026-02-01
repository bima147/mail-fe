import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type TrashItem = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  deletedAt: string;
};

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss',
})
export class TrashComponent {
  items: TrashItem[] = [
    {
      id: '1',
      from: 'Promo',
      subject: 'Discount 50%',
      preview: 'Limited deal for you...',
      deletedAt: 'Today',
    },
    {
      id: '2',
      from: 'System',
      subject: 'Notification',
      preview: 'Your account settings changed...',
      deletedAt: 'Sun',
    },
  ];
  selected: TrashItem | null = this.items[0];
  selectItem(x: TrashItem) {
    this.selected = x;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type DraftItem = {
  id: string;
  to: string;
  subject: string;
  preview: string;
  updated: string;
};

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.scss',
})
export class DraftsComponent {
  drafts: DraftItem[] = [
    {
      id: '1',
      to: 'Recruiter',
      subject: 'Follow up',
      preview: 'Hi, just following up about...',
      updated: '10:02',
    },
    {
      id: '2',
      to: '(no recipient)',
      subject: 'Notes',
      preview: 'Things to do this week...',
      updated: 'Mon',
    },
  ];
  selected: DraftItem | null = this.drafts[0];
  selectDraft(d: DraftItem) {
    this.selected = d;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type MailItem = {
  id: string;
  to: string;
  subject: string;
  preview: string;
  time: string;
};

@Component({
  selector: 'app-sent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sent.component.html',
  styleUrl: './sent.component.scss',
})
export class SentComponent {
  mails: MailItem[] = [
    {
      id: '1',
      to: 'Client A',
      subject: 'Proposal update',
      preview: 'I sent the updated proposal...',
      time: 'Today',
    },
    {
      id: '2',
      to: 'Team',
      subject: 'Weekly report',
      preview: 'Here is the weekly report...',
      time: 'Yesterday',
    },
  ];
  selected: MailItem | null = this.mails[0];
  selectMail(m: MailItem) {
    this.selected = m;
  }
}

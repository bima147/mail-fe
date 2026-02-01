import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

type Tag = 'Work' | 'Personal' | 'Billing';
type Filter = 'all' | 'unread' | 'starred';

export type MailItem = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  time: string;

  unread: boolean;
  starred: boolean;
  tag?: Tag;
};

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
})
export class InboxComponent {
  constructor(private router: Router) {}

  // ===== Dummy data =====
  private seed(): MailItem[] {
    return [
      {
        id: '1',
        from: 'GitHub',
        subject: 'Security alert',
        preview: 'We found a vulnerability in your repository...',
        body: 'Hi,\n\nWe found a vulnerability in your repository. Please review the security advisory and update dependencies.\n\nThanks,\nGitHub',
        time: '09:12',
        unread: true,
        starred: true,
        tag: 'Work',
      },
      {
        id: '2',
        from: 'Bank',
        subject: 'Monthly statement',
        preview: 'Your statement for January is ready...',
        body: 'Hello,\n\nYour monthly statement is ready. Please login to your account to view.\n\nRegards,\nBank',
        time: '08:05',
        unread: false,
        starred: false,
        tag: 'Billing',
      },
      {
        id: '3',
        from: 'HR Team',
        subject: 'Interview schedule',
        preview: 'Your interview is confirmed for Friday...',
        body: 'Hi,\n\nYour interview is confirmed for Friday at 10:00.\n\nBest,\nHR Team',
        time: 'Yesterday',
        unread: true,
        starred: false,
        tag: 'Work',
      },
      {
        id: '4',
        from: 'Friend',
        subject: 'Weekend plan',
        preview: 'Let’s hangout this weekend—are you free?',
        body: 'Yo!\n\nLet’s hangout this weekend—are you free?\n\nCheers,\nFriend',
        time: 'Mon',
        unread: false,
        starred: false,
        tag: 'Personal',
      },
    ];
  }

  mails: MailItem[] = this.seed();
  selected: MailItem | null = this.mails[0] ?? null;

  filter: Filter = 'all';
  toast = '';

  // ===== Derived list =====
  get visibleMails(): MailItem[] {
    if (this.filter === 'unread') return this.mails.filter((m) => m.unread);
    if (this.filter === 'starred') return this.mails.filter((m) => m.starred);
    return this.mails;
  }

  // ===== actions (UI) =====
  setFilter(f: Filter) {
    this.filter = f;

    // jika selected tidak ada di hasil filter, pilih yg pertama
    if (
      this.selected &&
      !this.visibleMails.some((m) => m.id === this.selected!.id)
    ) {
      this.selected = this.visibleMails[0] ?? null;
    }
  }

  refresh() {
    this.mails = this.seed();
    this.selected = this.mails[0] ?? null;
    this.filter = 'all';
    this.showToast('Inbox refreshed');
  }

  selectMail(m: MailItem) {
    this.selected = m;
    m.unread = false;
  }

  toggleStar(m: MailItem) {
    m.starred = !m.starred;
    this.showToast(m.starred ? 'Starred' : 'Unstarred');
  }

  markAsRead(m: MailItem) {
    m.unread = false;
    this.showToast('Marked as read');
  }

  markAsUnread(m: MailItem) {
    m.unread = true;
    this.showToast('Marked as unread');
  }

  // Trash dari list (per item) - dummy remove dari inbox
  moveItemToTrash(m: MailItem) {
    const id = m.id;
    const wasSelected = this.selected?.id === id;

    this.mails = this.mails.filter((x) => x.id !== id);

    if (wasSelected) this.selected = this.visibleMails[0] ?? null;
    this.showToast('Moved to trash (dummy)');
  }

  // Trash dari detail (selected)
  moveSelectedToTrash() {
    if (!this.selected) return;
    this.moveItemToTrash(this.selected);
  }

  // ===== Compose page navigation =====
  newMail() {
    this.router.navigateByUrl('/compose', {
      state: { title: 'Compose', to: '', subject: '', body: '' },
    });
  }

  reply() {
    if (!this.selected) return;
    this.router.navigateByUrl('/compose', {
      state: {
        title: 'Reply',
        to: this.selected.from,
        subject: `Re: ${this.selected.subject}`,
        body: `\n\n---\nReplying to:\n${this.selected.body}`,
      },
    });
  }

  forward() {
    if (!this.selected) return;
    this.router.navigateByUrl('/compose', {
      state: {
        title: 'Forward',
        to: '',
        subject: `Fwd: ${this.selected.subject}`,
        body: `\n\n---\nForwarded message:\nFrom: ${this.selected.from}\n\n${this.selected.body}`,
      },
    });
  }

  // ===== toast =====
  private showToast(msg: string) {
    this.toast = msg;
    window.clearTimeout((this as any)._t);
    (this as any)._t = window.setTimeout(() => (this.toast = ''), 1600);
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type SendMode = 'Send now' | 'Schedule send';

type AttachmentItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url: string; // object url
  isImage: boolean;
};

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compose.component.html',
  styleUrl: './compose.component.scss',
})
export class ComposeComponent implements OnInit, OnDestroy {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  title = 'Compose';

  to = '';
  cc = '';
  bcc = '';
  subject = '';

  showCc = false;
  showBcc = false;

  // editor
  bodyHtml = '';
  plainTextMode = false;
  spellcheckOn = true;

  toast = '';
  error = '';

  // popups
  sendMenuOpen = false;
  moreMenuOpen = false;
  formatOpen = false;
  linkOpen = false;
  emojiOpen = false;

  // formatting
  fonts = [
    'Sans Serif',
    'Arial',
    'Verdana',
    'Tahoma',
    'Times New Roman',
    'Georgia',
    'Courier New',
  ];
  fontName = 'Sans Serif';
  fontSizes = [
    { label: 'Small', value: '2' },
    { label: 'Normal', value: '3' },
    { label: 'Large', value: '4' },
    { label: 'Huge', value: '5' },
  ];
  fontSize = '3';
  foreColor = '#111111';

  // link
  linkText = '';
  linkUrl = '';

  // emoji
  emojis = ['😀', '😁', '😂', '😍', '👍', '🙏', '🎉', '🔥', '✅', '📌', '📎'];

  // autosave dummy
  draftStatus: 'Saved' | 'Saving…' | '' = '';
  private _autosaveTimer: any;

  // schedule modal
  scheduleOpen = false;
  scheduleDate = ''; // yyyy-mm-dd
  scheduleTime = ''; // HH:mm

  // attachments
  attachments: AttachmentItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // default schedule: tomorrow 09:00
    const d = new Date();
    d.setDate(d.getDate() + 1);
    this.scheduleDate = this.toDateInputValue(d);
    this.scheduleTime = '09:00';

    setTimeout(() => {
      if (this.editor?.nativeElement) {
        this.editor.nativeElement.innerHTML = this.bodyHtml || '';
        this.editor.nativeElement.spellcheck = this.spellcheckOn;
      }
    }, 0);

    this.scheduleAutosave();
  }

  ngOnDestroy(): void {
    for (const a of this.attachments) URL.revokeObjectURL(a.url);
  }

  // ===== global keyboard
  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      this.send('Send now');
    }
    if (e.key === 'Escape') {
      this.sendMenuOpen = false;
      this.moreMenuOpen = false;
      this.linkOpen = false;
      this.emojiOpen = false;
      this.formatOpen = false;
      this.scheduleOpen = false;
    }
  }

  // click outside popups
  closeAllPopups() {
    this.sendMenuOpen = false;
    this.moreMenuOpen = false;
    this.linkOpen = false;
    this.emojiOpen = false;
    this.formatOpen = false;
  }

  // ===== editor
  onEditorInput() {
    this.bodyHtml = this.editor?.nativeElement?.innerHTML ?? '';
    this.onAnyChange();
  }

  focusEditor() {
    this.editor?.nativeElement?.focus();
  }

  // ===== autosave dummy
  onAnyChange() {
    this.error = '';
    this.scheduleAutosave();
  }

  private scheduleAutosave() {
    window.clearTimeout(this._autosaveTimer);
    this.draftStatus = 'Saving…';

    this._autosaveTimer = window.setTimeout(() => {
      this.draftStatus = 'Saved';
      window.setTimeout(() => (this.draftStatus = ''), 1200);
    }, 650);
  }

  private isValidRequired(): boolean {
    this.error = '';
    if (!this.to.trim() || !this.subject.trim()) {
      this.error = 'To dan Subject wajib diisi.';
      return false;
    }
    return true;
  }

  // ===== cc/bcc
  toggleCc() {
    this.showCc = !this.showCc;
  }
  toggleBcc() {
    this.showBcc = !this.showBcc;
  }

  // ===== formatting
  toggleFormatBar() {
    this.formatOpen = !this.formatOpen;
    setTimeout(() => this.focusEditor(), 0);
  }

  cmd(command: string, value?: string) {
    if (this.plainTextMode) {
      this.showToast('Matikan Plain text mode untuk formatting.');
      return;
    }
    this.focusEditor();
    document.execCommand(command, false, value);
    this.bodyHtml = this.editor?.nativeElement?.innerHTML ?? '';
    this.onAnyChange();
  }

  // insert helpers
  insertHTML(html: string) {
    if (this.plainTextMode) {
      this.insertText(this.htmlToText(html));
      return;
    }
    this.focusEditor();
    document.execCommand('insertHTML', false, html);
    this.bodyHtml = this.editor?.nativeElement?.innerHTML ?? '';
    this.onAnyChange();
  }

  insertText(text: string) {
    this.focusEditor();
    try {
      document.execCommand('insertText', false, text);
    } catch {
      document.execCommand(
        'insertHTML',
        false,
        this.escapeHtml(text).replace(/\n/g, '<br>')
      );
    }
    this.bodyHtml = this.editor?.nativeElement?.innerHTML ?? '';
    this.onAnyChange();
  }

  // ===== link
  openLink() {
    this.linkText = '';
    this.linkUrl = '';
    this.linkOpen = true;

    this.emojiOpen = false;
    this.moreMenuOpen = false;
    this.formatOpen = false;
  }

  insertLink() {
    const url = this.linkUrl.trim();
    if (!url) return;
    const text = (this.linkText || url).trim();

    const html = `<a href="${this.escapeAttr(
      url
    )}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(text)}</a>`;
    this.insertHTML(html);

    this.linkOpen = false;
  }

  // ===== emoji
  toggleEmoji() {
    this.emojiOpen = !this.emojiOpen;
    this.linkOpen = false;
    this.moreMenuOpen = false;
    this.formatOpen = false;
  }

  addEmoji(e: string) {
    this.insertText(e);
    this.emojiOpen = false;
  }

  // ===== send & schedule
  send(mode: SendMode) {
    this.sendMenuOpen = false;

    if (!this.isValidRequired()) return;

    if (mode === 'Schedule send') {
      this.openSchedule();
      return;
    }

    // TODO: call API send
    // payload includes: this.bodyHtml + this.attachments
    this.showToast('Email sent (dummy)');
    setTimeout(() => this.router.navigateByUrl('/inbox'), 600);
  }

  openSchedule() {
    if (!this.isValidRequired()) return;
    this.scheduleOpen = true;

    this.moreMenuOpen = false;
    this.formatOpen = false;
    this.linkOpen = false;
    this.emojiOpen = false;
  }

  closeSchedule() {
    this.scheduleOpen = false;
  }

  setPreset(hoursFromNow: number) {
    const d = new Date();
    d.setHours(d.getHours() + hoursFromNow);
    this.scheduleDate = this.toDateInputValue(d);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    this.scheduleTime = `${hh}:${mm}`;
  }

  scheduleSend() {
    if (!this.isValidRequired()) return;

    if (!this.scheduleDate || !this.scheduleTime) {
      this.showToast('Pilih tanggal & jam dulu');
      return;
    }

    const scheduledAt = new Date(
      `${this.scheduleDate}T${this.scheduleTime}:00`
    );
    if (isNaN(scheduledAt.getTime())) {
      this.showToast('Tanggal/jam tidak valid');
      return;
    }

    const now = new Date();
    if (scheduledAt.getTime() <= now.getTime() + 30_000) {
      this.showToast('Waktu schedule harus lebih dari sekarang');
      return;
    }

    // TODO: call API schedule send
    this.scheduleOpen = false;
    this.showToast(`Scheduled: ${scheduledAt.toLocaleString()}`);
    setTimeout(() => this.router.navigateByUrl('/inbox'), 800);
  }

  // ===== More menu features
  doPrint() {
    this.moreMenuOpen = false;
    const bodyForPrint = this.getBodyHtmlForPrint();

    const attachmentsHtml = this.attachments.length
      ? `
        <div style="margin-top:16px;border-top:1px solid #ddd;padding-top:12px">
          <b>Attachments:</b>
          <ul>
            ${this.attachments
              .map(
                (a) =>
                  `<li>${this.escapeHtml(a.name)} (${this.formatBytes(
                    a.size
                  )})</li>`
              )
              .join('')}
          </ul>
        </div>`
      : '';

    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Print Email</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
    .meta div { margin: 4px 0; }
    .subject { font-size: 18px; font-weight: 700; margin: 10px 0 14px 0; }
    .content { border-top: 1px solid #ddd; padding-top: 14px; }
    a { color: #0b57d0; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="meta">
    <div><b>To:</b> ${this.escapeHtml(this.to)}</div>
    ${this.cc.trim() ? `<div><b>Cc:</b> ${this.escapeHtml(this.cc)}</div>` : ''}
    ${
      this.bcc.trim()
        ? `<div><b>Bcc:</b> ${this.escapeHtml(this.bcc)}</div>`
        : ''
    }
    <div class="subject">${this.escapeHtml(this.subject)}</div>
  </div>
  <div class="content">${bodyForPrint}</div>
  ${attachmentsHtml}
</body>
</html>`.trim();

    const w = window.open(
      '',
      '_blank',
      'noopener,noreferrer,width=900,height=700'
    );
    if (!w) return this.showToast('Popup blocked. Izinkan pop-up untuk print.');
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 200);
  }

  toggleSpellcheck() {
    this.moreMenuOpen = false;
    this.spellcheckOn = !this.spellcheckOn;
    if (this.editor?.nativeElement)
      this.editor.nativeElement.spellcheck = this.spellcheckOn;
    this.showToast(this.spellcheckOn ? 'Spellcheck: ON' : 'Spellcheck: OFF');
  }

  togglePlainTextMode() {
    this.moreMenuOpen = false;
    if (!this.editor?.nativeElement) return;

    this.plainTextMode = !this.plainTextMode;

    if (this.plainTextMode) {
      const plain = this.editor.nativeElement.innerText || '';
      this.editor.nativeElement.innerText = plain;
      this.bodyHtml = this.escapeHtml(plain).replace(/\n/g, '<br>');
      this.formatOpen = false;
      this.showToast('Plain text mode: ON');
    } else {
      const plain = this.editor.nativeElement.innerText || '';
      const html = this.textToHtml(plain);
      this.editor.nativeElement.innerHTML = html;
      this.bodyHtml = html;
      this.showToast('Plain text mode: OFF');
    }

    this.onAnyChange();
    this.focusEditor();
  }

  // ===== attachments
  onAttachFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    for (const f of incoming) {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const url = URL.createObjectURL(f);

      this.attachments.push({
        id,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        url,
        isImage: (f.type || '').startsWith('image/'),
      });
    }

    this.showToast(`${incoming.length} file attached`);
    this.onAnyChange();
  }

  removeAttachment(id: string) {
    const idx = this.attachments.findIndex((a) => a.id === id);
    if (idx === -1) return;
    const [removed] = this.attachments.splice(idx, 1);
    URL.revokeObjectURL(removed.url);
    this.showToast('Attachment removed');
    this.onAnyChange();
  }

  downloadAttachment(a: AttachmentItem) {
    const link = document.createElement('a');
    link.href = a.url;
    link.download = a.name;
    link.click();
  }

  openAttachment(a: AttachmentItem) {
    window.open(a.url, '_blank', 'noopener,noreferrer');
  }

  downloadAllAttachments() {
    for (const a of this.attachments) {
      this.downloadAttachment(a);
    }
  }

  // ===== discard
  clearAll() {
    this.to = '';
    this.cc = '';
    this.bcc = '';
    this.subject = '';
    this.showCc = false;
    this.showBcc = false;

    this.bodyHtml = '';
    if (this.editor?.nativeElement) this.editor.nativeElement.innerHTML = '';

    for (const a of this.attachments) URL.revokeObjectURL(a.url);
    this.attachments = [];

    this.onAnyChange();
    this.showToast('Draft discarded');
  }

  // ===== helpers
  formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let n = bytes;
    let i = 0;
    while (n >= 1024 && i < units.length - 1) {
      n = n / 1024;
      i++;
    }
    const val = i === 0 ? `${Math.round(n)}` : n.toFixed(2);
    return `${val} ${units[i]}`;
  }

  private toDateInputValue(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private textToHtml(text: string) {
    return this.escapeHtml(text).replace(/\n/g, '<br>');
  }

  private htmlToText(html: string) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.innerText || '';
  }

  private getBodyHtmlForPrint(): string {
    if (!this.editor?.nativeElement) return this.bodyHtml || '';
    if (this.plainTextMode)
      return this.textToHtml(this.editor.nativeElement.innerText || '');
    return this.editor.nativeElement.innerHTML || this.bodyHtml || '';
  }

  private escapeHtml(s: string) {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  private escapeAttr(s: string) {
    return s.replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  private showToast(msg: string) {
    this.toast = msg;
    window.clearTimeout((this as any)._t);
    (this as any)._t = window.setTimeout(() => (this.toast = ''), 1500);
  }
}

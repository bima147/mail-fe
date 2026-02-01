import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type ListDensity = 'standard' | 'compact';
export type ListView = 'three' | 'two';
export type AbstractMode = 'show' | 'hide';
export type ReadingMode = 'standard' | 'comfortable';

export type QuickSettings = {
  avatarDisplay: boolean;
  listDensity: ListDensity;
  listView: ListView;
  abstractMode: AbstractMode;
  readingMode: ReadingMode;
};

@Component({
  selector: 'app-settings-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-drawer.component.html',
  styleUrl: './settings-drawer.component.scss',
})
export class SettingsDrawerComponent {
  @Input({ required: true }) open = false;
  @Input({ required: true }) value!: QuickSettings;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<QuickSettings>();

  close() {
    this.openChange.emit(false);
  }

  // ESC to close
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.close();
  }

  // helpers to update state immutably
  patch(p: Partial<QuickSettings>) {
    this.valueChange.emit({ ...this.value, ...p });
  }

  toggleAvatar() {
    this.patch({ avatarDisplay: !this.value.avatarDisplay });
  }
}

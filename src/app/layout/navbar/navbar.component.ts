import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { AppComponent } from '../../app.component';
import {
  QuickSettings,
  SettingsDrawerComponent,
} from '../settings-drawer/settings-drawer.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [SettingsDrawerComponent],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(public theme: ThemeService) {}

  toggleTheme() {
    this.theme.toggle();
  }

  settingsOpen = false;

  settings: QuickSettings = {
    avatarDisplay: true,
    listDensity: 'standard',
    listView: 'three',
    abstractMode: 'show',
    readingMode: 'standard',
  };

  openSettings() {
    this.settingsOpen = true;
  }

  // contoh: apply settings ke UI (optional)
  onSettingsChange(v: QuickSettings) {
    this.settings = v;

    // contoh apply density ke body attribute (dipakai inbox list)
    document.documentElement.setAttribute('data-density', v.listDensity);
    document.documentElement.setAttribute('data-listview', v.listView);
    document.documentElement.setAttribute('data-abstract', v.abstractMode);
    document.documentElement.setAttribute('data-reading', v.readingMode);
    document.documentElement.setAttribute(
      'data-avatars',
      v.avatarDisplay ? '1' : '0'
    );
  }
}

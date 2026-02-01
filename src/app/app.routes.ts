import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  // LOGIN: tanpa navbar/sidebar/footer
  { path: 'login', component: LoginComponent },

  // APP (sudah login): pakai layout shell
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'compose',
        loadComponent: () =>
          import('./features/mail/compose/compose.component').then(
            (m) => m.ComposeComponent
          ),
      },
      {
        path: 'inbox',
        loadComponent: () =>
          import('./features/mail/inbox/inbox.component').then(
            (m) => m.InboxComponent
          ),
      },
      {
        path: 'sent',
        loadComponent: () =>
          import('./features/mail/sent/sent.component').then(
            (m) => m.SentComponent
          ),
      },
      {
        path: 'drafts',
        loadComponent: () =>
          import('./features/mail/drafts/drafts.component').then(
            (m) => m.DraftsComponent
          ),
      },
      {
        path: 'trash',
        loadComponent: () =>
          import('./features/mail/trash/trash.component').then(
            (m) => m.TrashComponent
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inbox' },
    ],
  },

  { path: '**', redirectTo: '' },
];

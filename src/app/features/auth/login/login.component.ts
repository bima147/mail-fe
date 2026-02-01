import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  remember = true;
  error: string | null = null;

  constructor(private router: Router) {} // private auth: AuthService

  submit() {
    this.error = '';

    // TODO: panggil auth service kamu di sini
    // this.auth.login(this.email, this.password).subscribe({
    //   next: () => this.router.navigateByUrl('/inbox'),
    //   error: () => (this.error = 'Email atau password salah')
    // });

    // Demo: anggap sukses
    if (!this.email || !this.password) {
      this.error = 'Email dan password wajib diisi';
      return;
    }
    this.router.navigateByUrl('/inbox');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string }>('/api/auth/login', { email, password })
      .pipe(
        tap((res) => localStorage.setItem(this.TOKEN_KEY, res.accessToken))
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}

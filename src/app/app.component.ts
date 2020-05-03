import { Component } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'playlistFrontEnd';
  public User;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.authState.subscribe(res => {
      console.log(res);
    });
    this.User = JSON.parse(localStorage.getItem('user'));

  }
  async signOut() {

    await this.authService.signOut().catch(err => {
      console.log(err)
    });
    await localStorage.removeItem('user');

    this.router.navigateByUrl("/login")

  }

  isLogin() {
    return localStorage.getItem('user') && localStorage.getItem('user') != null && localStorage.getItem('user') != "null";
  }
}

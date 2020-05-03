import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { PlaylistService } from '../playlistService/playlist.service';
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('743947251420-ddsdgib62o3t185l8c308u5ls7n7q289.apps.googleusercontent.com')
  }
]);
export function provideConfig() {
  return config;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, private authService: AuthService,
    private playlistService: PlaylistService
  ) {
    if (localStorage.getItem('user') && localStorage.getItem('user') != null && localStorage.getItem('user') != "null") {
      router.navigateByUrl("/");
    }
  }

  ngOnInit(): void {

    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
  }
  async signIn() {
    await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe(res => {
      console.log(res);
      this.playlistService.postUser(res).subscribe(resp => {
        console.log(resp);
        localStorage.setItem('user', JSON.stringify(res));
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.router.navigateByUrl(this.returnUrl);
      });


    });
  }


}

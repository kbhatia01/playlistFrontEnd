import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, AuthService } from 'angularx-social-login';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    currentUser = null;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {

    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(localStorage.getItem('user'));
        if (localStorage.getItem('user') && localStorage.getItem('user') != null && localStorage.getItem('user') != "null") {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
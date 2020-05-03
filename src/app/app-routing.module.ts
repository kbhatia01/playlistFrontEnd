import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../_helper/AuthGuard';
import { HomeComponent } from './home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuard], redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'playlist', canActivate: [AuthGuard], component: PlaylistComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

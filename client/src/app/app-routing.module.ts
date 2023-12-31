import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';

import { UserGuard } from './services/user.guard';
import { WikiComponent } from './wiki/wiki.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'privacy-policy', component: PrivacyPolicyComponent },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'wiki', component: WikiComponent },
  { path: 'mis-datos', component: EditUserComponent, canActivate: [UserGuard] },
  { path: 'usuarios', component: UsersComponent, canActivate: [UserGuard] },
  { path: 'usuarios/:page', component: UsersComponent, canActivate: [UserGuard] },
  { path: 'timeline', component: TimelineComponent, canActivate: [UserGuard] },
  { path: 'perfil/:id', component: ProfileComponent, canActivate: [UserGuard] },
  { path: 'siguiendo/:id/:page', component: FollowingComponent, canActivate: [UserGuard] },
  { path: 'seguidores/:id/:page', component: FollowedComponent, canActivate: [UserGuard] }
  // { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

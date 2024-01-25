import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
// import { AuthGuard } from './guards/auth.guard';
// import { HomeComponent } from './components/home/home.component';
// import { UsersComponent } from './components/user/users/users.component';
// import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
// import { UpdateUserProfileComponent } from './components/user/update-user-profile/update-user-profile.component';
// import { CreateBlogEntryComponent } from './components/blog-entry/create-blog-entry/create-blog-entry.component';
// import { ViewBlogEntryComponent } from './components/blog-entry/view-blog-entry/view-blog-entry.component';


export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

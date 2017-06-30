import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { BlogComponent } from './component/blog/blog.component';
import { EditBlogComponent } from './component/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './component/blog/delete-blog/delete-blog.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';

const appRoutes: Routes = [
  { path: '',
    component: HomeComponent
  },
  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog',
    component: BlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-blog/:id',
    component: EditBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delete-blog/:id',
    component: DeleteBlogComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }
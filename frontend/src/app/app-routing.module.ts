import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./screens/auth/auth.guard";
import { LoginComponent } from "./screens/auth/login/login.component";
import { SignupComponent } from "./screens/auth/signup/signup.component";
import { CommentCreateComponent } from "./screens/comments/comment-create.component";
import { ProjectCreateComponent } from "./screens/projects/project-create/project-create.component";
import { ProjectListComponent } from "./screens/projects/project-list/project-list.component";

const routes: Routes = [
  {
    path:'',
    component: ProjectListComponent, canActivate:[AuthGuard]
  },
  {
    path:'create',
    component: ProjectCreateComponent, canActivate:[AuthGuard]
  },
  {
    path:'addComment/:projectId',
    component: CommentCreateComponent, canActivate:[AuthGuard]
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'signup',
    component: SignupComponent
  },
]

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule],
  providers:[AuthGuard]


})
export class AppRoutingModule{

}

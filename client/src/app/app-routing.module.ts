import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./user/user.module').then((module) => module.UserModule),
  },
  {
    path: 'group',
    loadChildren: () =>
      import('./group/group.module').then((module) => module.GroupModule),
  },
  {
    path: 'user-access',
    loadChildren: () =>
      import('./user-access/user-access.module').then(
        (module) => module.UserAccessModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccessComponent } from './user-access.component';

const route: Routes = [{ path: '', component: UserAccessComponent }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class UserAccessRoutingModule {}

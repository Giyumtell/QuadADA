import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [UserComponent, UserFormComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}

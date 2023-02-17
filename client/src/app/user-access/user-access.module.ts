import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccessRoutingModule } from './user-access-routing.module';
import { UserAccessComponent } from './user-access.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserAccessComponent],
  imports: [CommonModule, UserAccessRoutingModule, SharedModule],
})
export class UserAccessModule {}

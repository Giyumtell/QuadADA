import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccessRoutingModule } from './user-access-routing.module';
import { UserAccessComponent } from './user-access.component';

@NgModule({
  declarations: [UserAccessComponent],
  imports: [CommonModule, UserAccessRoutingModule],
})
export class UserAccessModule {}

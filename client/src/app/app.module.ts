import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';
import { UserAccessComponent } from './user-access/user-access.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, NavbarComponent, UserComponent, GroupComponent, UserAccessComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Injectable } from '@angular/core';
import { GroupService } from '../group/group.service';
import { UserAccessService } from '../user-access/user-access.service';
import { UserService } from '../user/user.service';
@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  //variable declaration
  public activeTab: string;
  public editMode: boolean;
  public formValidity: boolean;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private userAccessService: UserAccessService
  ) {
    //variable initialization
    this.formValidity = true;
    this.activeTab = '';
    this.editMode = false;
  }
  toggleEdit = () => {
    if (this.editMode) {
      //getting out of edit mode
      if (this.activeTab === 'User') this.userService.toggle();
      if (this.activeTab === 'Group') this.groupService.toggle();
      if (this.activeTab === 'UserAccess') this.userAccessService.toggle();
    } else {
      //getting into edit mode
      if (this.activeTab === 'User') this.userService.generateControls();
      if (this.activeTab === 'Group') this.groupService.generateControls();
      if (this.activeTab === 'UserAccess') this.userAccessService.generateControls();
    }
    this.editMode = !this.editMode;
  };

  save = () => {
    switch (this.activeTab) {
      case 'User':
        this.userService.persist();
        this.toggleEdit();
        break;
      case 'Group':
        this.groupService.persist();
        this.toggleEdit();
        break;
      case 'UserAccess':
        this.userAccessService.persist();
        this.toggleEdit();
        break;
    }
  };
}

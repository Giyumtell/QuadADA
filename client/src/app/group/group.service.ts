import { Injectable } from '@angular/core';
import { Group } from '../shared/models/group';
import { UserAccessService } from '../user-access/user-access.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groups: Group[];

  constructor(private userAccessService: UserAccessService) {
    this.groups = [
      {
        id: '1',
        name: 'group1',
        description: 'this is group 1',
      },
      {
        id: '2',
        name: 'group2',
        description: 'this is group 2',
      },
      {
        id: '3',
        name: 'group3',
        description: 'this is group 3',
      },
    ];
  }
  //GROUP SERVICES///////////////////////////////////////
  //if group doesnt exist we add it to the array of groups
  public addNewGroup = (group: Group) => {
    if (this.indexOfGroupOrFalse(group.id) === false) {
      this.groups = [...this.groups, group];
      return true;
    }
    return false;
  };
  //remove group from data and also any user X group connection related to group
  public removeGroup = (id: string) => {
    this.userAccessService.userAccesses =
      this.userAccessService.userAccesses.filter((item) => item.groupId !== id);
    this.groups = this.groups.filter((group) => group.id !== id);
  };
  //find the user index and replace it
  public updateGroup = (group: Group) => {
    var index = this.indexOfGroupOrFalse(group.id);
    if (index !== false) {
      this.groups[index] = group;
      return true;
    }
    return false;
  };
  //calling update on each element of array
  public updateGroupBalk = (groups: Group[]) => {
    groups.forEach((group) => this.updateGroup(group));
  };
  //adding each element of array
  public addNewGroupBalk = (groups: Group[]) => {
    groups.forEach((group) => this.addNewGroup(group));
  };
  ///////////////////////////////////////////////////////
  //check if the new groupId exists in the mock data
  //index of group if exists and false if not
  public indexOfGroupOrFalse = (id: string) => {
    var index = this.groups.findIndex(
      (group) => group.id.toLowerCase() === id.toLowerCase()
    );
    return index === -1 ? false : index;
  };
  persist = () => {};
}

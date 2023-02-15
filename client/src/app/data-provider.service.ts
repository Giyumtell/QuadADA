import { Injectable } from '@angular/core';
import { Data } from './_models/data';
import { Group } from './_models/group';
import { User } from './_models/user';
import { UserAccess } from './_models/userAccess';
@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  //mock data declaration
  public data: Data;
  //variable declaration
  public activeTab: string;
  public editMode: boolean;
  constructor() {
    //initializing the mock data
    this.data = {
      users: [
        {
          userId: 'Jdoe1',
          firstName: 'john1',
          lastName: 'doe',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
        {
          userId: 'Jdoe2',
          firstName: 'john2',
          lastName: 'doe',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
        {
          userId: 'Jdoe3',
          firstName: 'john3',
          lastName: 'doe',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
        {
          userId: 'Jdoe4',
          firstName: 'john4',
          lastName: 'doe',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
      ],
      groups: [
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
      ],
      userAccesses: [
        {
          userId: 'Jdoe1',
          groupId: '1',
          creationDate: new Date('2023-02-14'),
        },
        {
          userId: 'Jdoe2',
          groupId: '1',
          creationDate: new Date('2023-02-14'),
        },
        {
          userId: 'Jdoe3',
          groupId: '2',
          creationDate: new Date('2023-02-13'),
        },
        {
          userId: 'Jdoe4',
          groupId: '2',
          creationDate: new Date('2023-02-13'),
        },
      ],
    };
    //variable initialization
    this.activeTab = 'User';
    this.editMode = false;
  }
  //USER SERVICES///////////////////////////////////////
  //if user doesnt exist we add it to the array of users
  public addNewUser = (user: User) => {
    if (this.indexOfUserOrFalse(user.userId) === false) {
      this.data.users = [...this.data.users, user];
      return true;
    }
    return false;
  };
  //remove user from data and also any user X group connection related to user
  public removeUser = (id: string) => {
    this.data.users = this.data.users.filter((user) => user.userId !== id);
    this.data.userAccesses = this.data.userAccesses.filter(
      (item) => item.userId !== id
    );
  };
  //find the user index and replace it
  public updateUser = (user: User) => {
    var index = this.indexOfUserOrFalse(user.userId);
    if (index !== false) {
      this.data.users[index] = user;
      return true;
    }
    return false;
  };
  //calling update on each element of array
  public updateUserBalk = (users: User[]) => {
    users.forEach((user) => this.updateUser(user));
  };
  //adding each element of array
  public addNewUserBalk = (users: User[]) => {
    users.forEach((user) => this.addNewUser(user));
  };
  ///////////////////////////////////////////////////////
  //GROUP SERVICES///////////////////////////////////////
  //if group doesnt exist we add it to the array of groups
  public addNewGroup = (group: Group) => {
    if (this.indexOfGroupOrFalse(group.id) === false) {
      this.data.groups = [...this.data.groups, group];
      return true;
    }
    return false;
  };
  //remove group from data and also any user X group connection related to group
  public removeGroup = (id: string) => {
    this.data.groups = this.data.groups.filter((group) => group.id !== id);
    this.data.userAccesses = this.data.userAccesses.filter(
      (item) => item.groupId !== id
    );
  };
  //find the user index and replace it
  public updateGroup = (group: Group) => {
    var index = this.indexOfGroupOrFalse(group.id);
    if (index !== false) {
      this.data.groups[index] = group;
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
  //USERACCESS SERVICES//////////////////////////////////
  //if UserAccess doesnt exist we add it to the array of UserAccess
  public addNewUserAccess = (userAccess: UserAccess) => {
    if (this.indexOfUserAccessOrFalse(userAccess) === false) {
      this.data.userAccesses = [...this.data.userAccesses, userAccess];
      return true;
    }
    return false;
  };
  //remove UserAccess from data
  public removeUserAccess = (userAccess: UserAccess) => {
    this.data.userAccesses = this.data.userAccesses.filter(
      (item) =>
        item.groupId !== userAccess.groupId && item.userId !== userAccess.userId
    );
  };
  //find the user index and replace it
  public updateUserAccess = (userAccess: UserAccess) => {
    var index = this.indexOfUserAccessOrFalse(userAccess);
    if (index !== false) {
      this.data.userAccesses[index] = userAccess;
      return true;
    }
    return false;
  };
  //calling update on each element of array
  public updateUserAccessBalk = (userAccesses: UserAccess[]) => {
    userAccesses.forEach((userAccess) => this.updateUserAccess(userAccess));
  };
  //adding each element of array
  public addNewUserAccessBalk = (userAccesses: UserAccess[]) => {
    userAccesses.forEach((userAccess) => this.addNewUserAccess(userAccess));
  };
  ///////////////////////////////////////////////////////

  //utilities:
  //check if the new userId exists in the mock data
  //index of user if exists and false if not
  private indexOfUserOrFalse = (id: string) => {
    var index = this.data.users.findIndex((user) => user.userId === id);
    return index === -1 ? false : index;
  };
  //check if the new groupId exists in the mock data
  //index of group if exists and false if not
  private indexOfGroupOrFalse = (id: string) => {
    var index = this.data.groups.findIndex((group) => group.id === id);
    return index === -1 ? false : index;
  };
  //check if the relation exists
  //index of userAccess if exists and false if not
  private indexOfUserAccessOrFalse = (userAccess: UserAccess) => {
    var index = this.data.userAccesses.findIndex(
      (item) =>
        item.groupId === userAccess.groupId && item.userId === userAccess.userId
    );
    return index === -1 ? false : index;
  };
}

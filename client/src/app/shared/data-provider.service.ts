import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { ColumnDefinition } from './models/columnDefinition';
import { Data } from './models/data';
import { Group } from './models/group';
import { User } from './models/user';
import { UserAccess } from './models/userAccess';
@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  //mock data declaration
  public data: Data;
  public filteredUser: User[] = [];
  public controlls: {};
  //variable declaration
  public activeTab: string;
  public editMode: boolean;
  public formValidity: boolean;
  //reactive form
  public userForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private userService: UserService) {
    //initializing the mock data
    this.data = {
      users: [
        {
          userId: 'JDoe',
          firstName: 'John',
          lastName: 'Doe',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
        {
          userId: 'DSmith',
          firstName: 'David',
          lastName: 'Smith',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
        {
          userId: 'ACerny',
          firstName: 'Amanda',
          lastName: 'Cerny',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
        {
          userId: 'PGriffin',
          firstName: 'Peter',
          lastName: 'Griffin',
          loginName: 'johnDoe',
          password: 'password',
          email: 'john@doe.com',
        },
        {
          userId: 'DSmall',
          firstName: 'David',
          lastName: 'Small',
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
    this.formValidity = true;
    this.activeTab = '';
    this.editMode = false;
    this.controlls = {};
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
    this.data.userAccesses = this.data.userAccesses.filter(
      (item) => item.userId !== id
    );
    this.data.users = this.data.users.filter((user) => user.userId !== id);
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
    this.data.userAccesses = this.data.userAccesses.filter(
      (item) => item.groupId !== id
    );
    this.data.groups = this.data.groups.filter((group) => group.id !== id);
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
  public indexOfUserOrFalse = (id: string) => {
    var index = this.data.users.findIndex((user) => user.userId === id);
    return index === -1 ? false : index;
  };
  //check if the new groupId exists in the mock data
  //index of group if exists and false if not
  public indexOfGroupOrFalse = (id: string) => {
    var index = this.data.groups.findIndex((group) => group.id === id);
    return index === -1 ? false : index;
  };
  //check if the relation exists
  //index of userAccess if exists and false if not
  public indexOfUserAccessOrFalse = (userAccess: UserAccess) => {
    var index = this.data.userAccesses.findIndex(
      (item) =>
        item.groupId === userAccess.groupId && item.userId === userAccess.userId
    );
    return index === -1 ? false : index;
  };
  initializeForm = (columns: ColumnDefinition[]) => {
    var objheader = {};
    columns.forEach((column) => {
      //
      if (column.filterable) {
        objheader[column.id] = [{ value: column.header, disabled: true }];
      }
    });
    var tempObj = { ...objheader, ...this.controlls };
    this.userForm = this.fb.group(tempObj);
  };
  resetForm = () => {
    var tempObj = { ...this.userForm.controls, ...this.controlls };
    this.userForm = this.fb.group(tempObj);
  };
  public generateControls = () => {
    switch (this.activeTab) {
      case 'User':
        this.filteredUser.forEach((user) => {
          this.controlls[user.userId] = [user.userId, Validators.required];
          this.controlls[user.firstName + user.userId] = [
            user.firstName,
            Validators.required,
          ];
          this.controlls[user.lastName + user.userId] = [
            user.lastName,
            Validators.required,
          ];
          this.controlls[user.loginName + user.userId] = [
            user.loginName,
            Validators.required,
          ];
          this.controlls[user.password + user.userId] = [
            user.password,
            Validators.required,
          ];
          this.controlls[user.email + user.userId] = [
            user.email,
            Validators.required,
          ];
        });
        break;
      default:
        break;
    }
  };
  toggleEdit = () => {
    if (this.editMode) {
      //getting out of edit mode
      this.resetForm();
      this.controlls = {};
      debugger;
      for (
        let i = 0;
        i < this.userService.lenNewUserArray &&
        this.userService.lenNewUserArray != 0;
        i++
      ) {
        this.userForm.removeControl('userId' + i);
        this.userForm.removeControl('firstName' + i);
        this.userForm.removeControl('lastName' + i);
        this.userForm.removeControl('loginName' + i);
        this.userForm.removeControl('password' + i);
        this.userForm.removeControl('email' + i);
      }
      this.userService.lenNewUserArray = 0;
    } else {
      //getting into edit mode
      this.generateControls();
    }
    this.editMode = !this.editMode;
  };

  save = () => {
    console.log(this.filteredUser);
  };
}

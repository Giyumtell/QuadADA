import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnDefinition } from '../shared/models/columnDefinition';
import { User } from '../shared/models/user';
import { UserControl } from '../shared/models/userControl';
import { UserAccessService } from '../user-access/user-access.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  columns: ColumnDefinition[];
  public filteredUser: User[];
  public newControlTracker: UserControl[];
  users: User[];
  public controls: {};
  //reactive form
  public userForm: FormGroup = new FormGroup({});
  maxLength: number;

  constructor(
    private userAccessService: UserAccessService,
    private fb: FormBuilder
  ) {
    this.controls = {};
    this.newControlTracker = [];
    this.maxLength = 0;
    this.users = [
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
    ];
    this.columns = [
      {
        id: 'userIdSearch',
        header: 'User Id',
        dataAlias: 'userId',
        filterable: true,
      },
      {
        id: 'firstNameSearch',
        header: 'First Name',
        dataAlias: 'firstName',
        filterable: true,
      },
      {
        id: 'lastNameSearch',
        header: 'Last Name',
        dataAlias: 'lastName',
        filterable: true,
      },
      {
        id: 'loginNameSearch',
        header: 'Login Name',
        dataAlias: 'loginName',
        filterable: true,
      },
      {
        id: 'passwordSearch',
        header: 'Password',
        dataAlias: 'password',
        filterable: false,
      },
      {
        id: 'emailSearch',
        header: 'Employee Email',
        dataAlias: 'email',
        filterable: true,
      },
    ];
    this.filteredUser = this.users;
  }
  newUserAdded = () => {
    this.maxLength++;
  };

  resetCountNewUser = () => {
    this.maxLength = 0;
  };

  //initializing form by generating controls for each column header and merging with controls for rows
  initializeForm = (columns: ColumnDefinition[]) => {
    var objheader = {};
    columns.forEach((column) => {
      //
      if (column.filterable) {
        objheader[column.id] = [{ value: column.header, disabled: true }];
      }
    });
    var tempObj = { ...objheader, ...this.controls };
    this.userForm = this.fb.group(tempObj);
  };
  //replacing old controls with new ones
  resetForm = () => {
    var tempObj = {
      ...this.userForm.controls,
      ...this.controls,
    };
    this.userForm = this.fb.group(tempObj);
  };
  //generating form controls for each input in every row
  public generateControls = () => {
    this.filteredUser.forEach((user) => {
      this.controls[user.userId] = [user.userId, Validators.required];
      this.controls[user.userId + 'firstName'] = [
        user.firstName,
        Validators.required,
      ];
      this.controls[user.userId + 'lastName'] = [
        user.lastName,
        Validators.required,
      ];
      this.controls[user.userId + 'loginName'] = [
        user.loginName,
        Validators.required,
      ];
      this.controls[user.userId + 'password'] = [
        user.password,
        Validators.required,
      ];
      this.controls[user.userId + 'email'] = [user.email, Validators.required];
    });
  };
  addControlToTracker = (controls: UserControl) => {
    this.newControlTracker.push(controls);
  };
  deleteControlTrackerAtIndex = (index: number) => {
    this.newControlTracker.splice(index, 1);
  };
  deleteControlAtIndex = (index: number) => {
    this.userForm.removeControl(this.newControlTracker[index].userId);
    this.userForm.removeControl(this.newControlTracker[index].firstName);
    this.userForm.removeControl(this.newControlTracker[index].lastName);
    this.userForm.removeControl(this.newControlTracker[index].loginName);
    this.userForm.removeControl(this.newControlTracker[index].password);
    this.userForm.removeControl(this.newControlTracker[index].email);
  };
  remove;
  //USER SERVICES///////////////////////////////////////
  //if user doesnt exist we add it to the array of users
  public addNewUser = (user: User) => {
    if (this.indexOfUserOrFalse(user.userId) === false) {
      this.users = [user, ...this.users];
      return true;
    }
    return false;
  };
  //remove user from data and also any user X group connection related to user
  public removeUser = (id: string) => {
    this.userAccessService.userAccesses =
      this.userAccessService.userAccesses.filter((item) => item.userId !== id);
    this.users = this.users.filter((user) => user.userId !== id);
  };
  //find the user index and replace it
  public updateOrAdd = (user: User) => {
    var index = this.indexOfUserOrFalse(user.userId);
    if (index !== false) {
      this.users[index] = user;
    } else {
      this.addNewUser(user);
    }
  };
  //calling update on each element of array
  public updateOrAddBalk = (users: User[]) => {
    users.forEach((user) => this.updateOrAdd(user));
  };

  //check if the new userId exists in the mock data
  //index of user if exists and false if not
  public indexOfUserOrFalse = (id: string) => {
    var index = this.users.findIndex(
      (user) => user.userId.toLowerCase() === id.toLowerCase()
    );
    return index === -1 ? false : index;
  };
  persist = () => {
    console.log(this.filteredUser);
    console.log(this.users);
    this.saveFormToTemp();
    console.log(this.filteredUser);
    console.log(this.users);
    this.updateOrAddBalk(this.filteredUser);
    console.log(this.filteredUser);
    console.log(this.users);
    this.filteredUser = this.users;
    console.log(this.filteredUser);
    console.log(this.users);
    this.generateControls();
    this.resetForm();
  };
  saveFormToTemp = () => {
    this.filteredUser.forEach((user, index) => {
      if (user.userId === '') {
        user.userId = this.userForm.get(
          this.newControlTracker[index].userId
        ).value;
        user.firstName = this.userForm.get(
          this.newControlTracker[index].firstName
        ).value;
        user.lastName = this.userForm.get(
          this.newControlTracker[index].lastName
        ).value;
        user.loginName = this.userForm.get(
          this.newControlTracker[index].loginName
        ).value;
        user.password = this.userForm.get(
          this.newControlTracker[index].password
        ).value;
        user.email = this.userForm.get(
          this.newControlTracker[index].email
        ).value;
        this.deleteControlAtIndex(index);
        this.deleteControlTrackerAtIndex(index);
        this.maxLength--;
      } else {
        user.firstName = this.userForm.get(user.userId + 'firstName').value;
        user.lastName = this.userForm.get(user.userId + 'lastName').value;
        user.loginName = this.userForm.get(user.userId + 'loginName').value;
        user.password = this.userForm.get(user.userId + 'password').value;
        user.email = this.userForm.get(user.userId + 'email').value;
      }
    });
  };
  toggle() {
    this.resetForm();
    this.controls = {};
    for (let i = 0; i < this.maxLength; i++) {
      this.filteredUser.shift();
      this.newControlTracker.pop();
    }
    this.maxLength = 0;
  }
}

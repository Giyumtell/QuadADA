import { Injectable } from '@angular/core';
import { ColumnDefinition } from '../shared/models/columnDefinition';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  columns: ColumnDefinition[];
  lenNewUserArray: number;

  constructor() {
    this.lenNewUserArray = 0;
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
  }
  newUserAdded = () => {
    this.lenNewUserArray++;
  };

  resetCountNewUser = ()  =>{
    this.lenNewUserArray = 0;
  }
}

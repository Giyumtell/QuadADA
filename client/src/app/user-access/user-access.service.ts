import { Injectable } from '@angular/core';
import { UserAccess } from '../shared/models/userAccess';

@Injectable({
  providedIn: 'root',
})
export class UserAccessService {
  userAccesses: UserAccess[];
  constructor() {
    this.userAccesses = [
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
    ];
  }
  //USERACCESS SERVICES//////////////////////////////////
  //if UserAccess doesnt exist we add it to the array of UserAccess
  public addNewUserAccess = (userAccess: UserAccess) => {
    if (this.indexOfUserAccessOrFalse(userAccess) === false) {
      this.userAccesses = [...this.userAccesses, userAccess];
      return true;
    }
    return false;
  };
  //remove UserAccess from data
  public removeUserAccess = (userAccess: UserAccess) => {
    this.userAccesses = this.userAccesses.filter(
      (item) =>
        item.groupId !== userAccess.groupId && item.userId !== userAccess.userId
    );
  };
  //find the user index and replace it
  public updateUserAccess = (userAccess: UserAccess) => {
    var index = this.indexOfUserAccessOrFalse(userAccess);
    if (index !== false) {
      this.userAccesses[index] = userAccess;
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
  //check if the relation exists
  //index of userAccess if exists and false if not
  public indexOfUserAccessOrFalse = (userAccess: UserAccess) => {
    var index = this.userAccesses.findIndex(
      (item) =>
        item.groupId.toLowerCase() === userAccess.groupId.toLowerCase() &&
        item.userId.toLowerCase() === userAccess.userId.toLowerCase()
    );
    return index === -1 ? false : index;
  };
  persist = () => {};
}

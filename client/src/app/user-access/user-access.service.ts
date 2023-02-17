import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnDefinition } from '../shared/models/columnDefinition';
import { UserAccess } from '../shared/models/userAccess';

@Injectable({
  providedIn: 'root',
})
export class UserAccessService {
  userAccesses: UserAccess[];
  filteredUserAccesses: UserAccess[];
  public newControlTracker: UserAccess[];
  public controls: {};
  //reactive form
  public userAccessesForm: FormGroup = new FormGroup({});
  maxLength: number;
  columns: ColumnDefinition[];
  constructor(private fb: FormBuilder) {
    this.controls = {};
    this.newControlTracker = [];
    this.maxLength = 0;
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
    this.columns = [
      {
        id: 'userIdSearch',
        header: 'User Id',
        dataAlias: 'userId',
        filterable: true,
      },
      {
        id: 'groupIdSearch',
        header: 'Group Id',
        dataAlias: 'groupId',
        filterable: true,
      },
      {
        id: 'creationDateSearch',
        header: 'Creation Date',
        dataAlias: 'creationDate',
        filterable: true,
      },
    ];
    this.filteredUserAccesses = this.userAccesses;
  }
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
    this.userAccessesForm = this.fb.group(tempObj);
  };
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
  //find the userAccess index and replace it otherwise add it
  public updateOrAdd = (access: UserAccess) => {
    var index = this.indexOfUserAccessOrFalse(access);
    if (index !== false) {
      this.userAccesses[index] = access;
    } else {
      this.addNewUserAccess(access);
    }
  };
  //calling update on each element of array
  public updateOrAddBalk = (userAccess: UserAccess[]) => {
    userAccess.forEach((element) => this.updateOrAdd(element));
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
  //generating form controls for each input in every row
  public generateControls = () => {
    this.filteredUserAccesses.forEach((access) => {
      this.controls[access.userId + access.groupId] = [
        access.userId,
        Validators.required,
      ];
      this.controls[access.groupId + access.userId] = [
        access.groupId,
        Validators.required,
      ];
    });
  };
  //replacing old controls with new ones
  resetForm = () => {
    var tempObj = {
      ...this.userAccessesForm.controls,
      ...this.controls,
    };
    this.userAccessesForm = this.fb.group(tempObj);
  };
  saveFormToTemp = () => {
    this.filteredUserAccesses.forEach((access, index) => {
      if (access.userId === '') {
        access.userId = this.userAccessesForm.get(
          this.newControlTracker[index].userId
        ).value;
        access.groupId = this.userAccessesForm.get(
          this.newControlTracker[index].groupId
        ).value;
        access.creationDate = new Date(Date.now());
        this.deleteControlAtIndex(index);
        this.deleteControlTrackerAtIndex(index);
        this.maxLength--;
      } else {
        access.userId = this.userAccessesForm.get(
          access.userId + access.groupId
        ).value;
        access.groupId = this.userAccessesForm.get(
          access.groupId + access.userId
        ).value;
      }
    });
  };
  addControlToTracker = (controls: UserAccess) => {
    this.newControlTracker.push(controls);
  };
  deleteControlTrackerAtIndex = (index: number) => {
    this.newControlTracker.splice(index, 1);
  };
  deleteControlAtIndex = (index: number) => {
    this.userAccessesForm.removeControl(this.newControlTracker[index].userId);
    this.userAccessesForm.removeControl(this.newControlTracker[index].groupId);
  };
  persist = () => {
    this.saveFormToTemp();
    this.updateOrAddBalk(this.filteredUserAccesses);
    this.filteredUserAccesses = this.userAccesses;
    this.generateControls();
    this.resetForm();
  };
  toggle() {
    this.resetForm();
    this.controls = {};
    for (let i = 0; i < this.maxLength; i++) {
      this.filteredUserAccesses.shift();
      this.newControlTracker.pop();
    }
    this.maxLength = 0;
  }
}

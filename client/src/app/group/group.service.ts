import { Injectable } from '@angular/core';
import { Group } from '../shared/models/group';
import { UserAccessService } from '../user-access/user-access.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnDefinition } from '../shared/models/columnDefinition';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groups: Group[];
  filteredGroups: Group[];
  public newControlTracker: Group[];
  public controls: {};
  //reactive form
  public groupForm: FormGroup = new FormGroup({});
  maxLength: number;
  columns: ColumnDefinition[];
  constructor(
    private userAccessService: UserAccessService,
    private fb: FormBuilder
  ) {
    this.controls = {};
    this.newControlTracker = [];
    this.maxLength = 0;
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
    this.columns = [
      {
        id: 'groupIdSearch',
        header: 'Group Id',
        dataAlias: 'id',
        filterable: true,
      },
      {
        id: 'nameSearch',
        header: 'Name',
        dataAlias: 'name',
        filterable: true,
      },
      {
        id: 'descSearch',
        header: 'Description',
        dataAlias: 'description',
        filterable: true,
      },
    ];
    this.filteredGroups = this.groups;
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
    this.groupForm = this.fb.group(tempObj);
  };
  //GROUP SERVICES///////////////////////////////////////
  //if group doesnt exist we add it to the array of groups
  public addNewGroup = (group: Group) => {
    if (this.indexOfGroupOrFalse(group.id) === false) {
      this.groups = [...this.groups, group];
      return true;
    }
    return false;
  };
  //remove group from data and also any group X group connection related to group
  public removeGroup = (id: string) => {
    this.userAccessService.userAccesses =
      this.userAccessService.userAccesses.filter((item) => item.groupId !== id);
    this.groups = this.groups.filter((group) => group.id !== id);
  };
  //find the group index and replace it otherwise add it
  public updateOrAdd = (group: Group) => {
    var index = this.indexOfGroupOrFalse(group.id);
    if (index !== false) {
      this.groups[index] = group;
    } else {
      this.addNewGroup(group);
    }
  };
  //calling update on each element of array
  public updateOrAddBalk = (group: Group[]) => {
    group.forEach((element) => this.updateOrAdd(element));
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
  persist = () => {
    this.saveFormToTemp();
    this.updateOrAddBalk(this.filteredGroups);
    this.filteredGroups = this.groups;
    this.generateControls();
    this.resetForm();
  };
  saveFormToTemp = () => {
    this.filteredGroups.forEach((group, index) => {
      if (group.id === '') {
        group.id = this.groupForm.get(this.newControlTracker[index].id).value;
        group.name = this.groupForm.get(
          this.newControlTracker[index].name
        ).value;
        group.description = this.groupForm.get(
          this.newControlTracker[index].description
        ).value;
        this.deleteControlAtIndex(index);
        this.deleteControlTrackerAtIndex(index);
        this.maxLength--;
      } else {
        group.name = this.groupForm.get(group.id + 'name').value;
        group.description = this.groupForm.get(group.id + 'description').value;
      }
    });
  };
  //generating form controls for each input in every row
  public generateControls = () => {
    this.filteredGroups.forEach((group) => {
      this.controls[group.id] = [group.id, Validators.required];
      this.controls[group.id + 'name'] = [group.name, Validators.required];
      this.controls[group.id + 'description'] = [
        group.description,
        Validators.required,
      ];
    });
  };
  addControlToTracker = (controls: Group) => {
    this.newControlTracker.push(controls);
  };
  deleteControlTrackerAtIndex = (index: number) => {
    this.newControlTracker.splice(index, 1);
  };
  deleteControlAtIndex = (index: number) => {
    this.groupForm.removeControl(this.newControlTracker[index].id);
    this.groupForm.removeControl(this.newControlTracker[index].name);
    this.groupForm.removeControl(this.newControlTracker[index].description);
  };
  //replacing old controls with new ones
  resetForm = () => {
    var tempObj = {
      ...this.groupForm.controls,
      ...this.controls,
    };
    this.groupForm = this.fb.group(tempObj);
  };
  toggle() {
    this.resetForm();
    this.controls = {};
    for (let i = 0; i < this.maxLength; i++) {
      this.filteredGroups.shift();
      this.newControlTracker.pop();
    }
    this.maxLength = 0;
  }
}

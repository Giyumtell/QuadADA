import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataProviderService } from '../shared/data-provider.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Group } from '../shared/models/group';
import { GroupService } from './group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit, AfterViewInit {
  @ViewChildren('headerRefArray') headerRef: any;
  headerRefArray: any;
  constructor(
    public dataProvider: DataProviderService,
    public groupService: GroupService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.dataProvider.activeTab = 'Group';
    this.dataProvider.editMode = false;
    this.groupService.generateControls();
    this.groupService.initializeForm(this.groupService.columns);
  }
  ngAfterViewInit() {
    //populating refArray with refrences after initialization
    this.headerRefArray = this.headerRef.map((para) => {
      return para.nativeElement;
    });
  }
  switchToEnable = (selector: string, index: number) => {
    this.groupService.groupForm.controls[selector].enable();
    this.headerRefArray[index].focus();
    this.headerRefArray[index].select();
  };
  //onBlure after clicking outside of a filter we disable it again and if its empty we set value to its default
  switchToDisable = (selector: string, index: number) => {
    this.groupService.groupForm.controls[selector].disable();
    if (
      this.groupService.groupForm.get(selector)?.value === '' ||
      this.groupService.groupForm.get(selector)?.value === null
    ) {
      this.groupService.groupForm.controls[selector].setValue(
        this.groupService.columns[index].header
      );
    }
  };
  //depending on what column header is callig we filter the temporary table
  filterColumn = (index: number) => {
    this.groupService.filteredGroups = this.groupService.groups.filter((item) =>
      item[this.groupService.columns[index].dataAlias]
        .toLowerCase()
        .includes(
          this.groupService.groupForm
            .get(this.groupService.columns[index].id)
            ?.value.toLowerCase()
        )
    );
  };
  addEmptyGroup = () => {
    //creating a new user
    let newGroup: Group = {
      id: '',
      name: '',
      description: '',
    };

    var len = this.groupService.maxLength;
    //keeping track of the new controllers names
    this.groupService.maxLength++;
    //generating a dynamic controler name for each input
    var tempObj = {};
    tempObj['id--' + len] = ['', Validators.required];
    tempObj['name--' + len] = ['', Validators.required];
    tempObj['description--' + len] = ['', Validators.required];
    this.groupService.addControlToTracker({
      id: 'id--' + len,
      name: 'name--' + len,
      description: 'description--' + len,
    });
    //adding new controllers to formGroup
    this.groupService.groupForm = this.fb.group({
      ...this.groupService.groupForm.controls,
      ...tempObj,
    });
    //adding new empty users to the temporary table
    this.groupService.filteredGroups.splice(len, 0, newGroup);
    //checking the validity because every input is empty at first
    this.dataProvider.formValidity = this.groupService.groupForm.valid;
  };
  //userId column checks if user exists on Blur event
  onBlur = (control: string) => {
    let value = this.groupService.groupForm.get(control).value;
    if (
      this.groupService.indexOfGroupOrFalse(value) !== false &&
      value !== ''
    ) {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.content = `${value} already defined`;
      modalRef.componentInstance.mode = false;
    }
  };
  //every Column checks if the form is valid on every single change in input
  onChange = () => {
    this.dataProvider.formValidity = this.groupService.groupForm.valid;
  };
  //remove a group from table
  removeGroup = (group: Group, index: number) => {
    if (group.id === '') {
      //if we are removing an empty temporary row
      let tempControlTracker = this.groupService.newControlTracker;
      this.groupService.filteredGroups.splice(index, 1);
      this.groupService.deleteControlAtIndex(index);
      this.groupService.deleteControlTrackerAtIndex(index);
      this.groupService.maxLength--;
    } else {
      //if we are removing a group
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.mode = true;
      modalRef.componentInstance.content = `${group.id} will be deleted. Confirm?`;
      modalRef.result
        .then((result) => {
          if (result === 'ok') {
            this.groupService.removeGroup(group.id);
            this.groupService.filteredGroups =
              this.groupService.filteredGroups.filter(
                (item) => item.id !== group.id
              );
          }
        })
        .catch((error) => {});
    }

    this.dataProvider.formValidity = this.groupService.groupForm.valid;
  };
}

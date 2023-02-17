import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupService } from '../group/group.service';
import { DataProviderService } from '../shared/data-provider.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { Group } from '../shared/models/group';
import { User } from '../shared/models/user';
import { UserAccess } from '../shared/models/userAccess';
import { UserService } from '../user/user.service';
import { UserAccessService } from './user-access.service';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
})
export class UserAccessComponent implements OnInit, AfterViewInit {
  @ViewChildren('headerRefArray') headerRef: any;
  headerRefArray: any;
  users: User[];
  groups: Group[];
  constructor(
    public dataProvider: DataProviderService,
    public userAccessService: UserAccessService,
    private userService: UserService,
    private groupService: GroupService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.users = userService.users;
    this.groups = groupService.groups;
  }

  ngOnInit(): void {
    this.dataProvider.activeTab = 'UserAccess';
    this.dataProvider.editMode = false;
    this.userAccessService.generateControls();
    this.userAccessService.initializeForm(this.userAccessService.columns);
  }
  ngAfterViewInit() {
    //populating refArray with refrences after initialization
    this.headerRefArray = this.headerRef.map((para) => {
      return para.nativeElement;
    });
    this.userAccessService.userAccessesForm.valueChanges.subscribe((data) => {
      // Perform necessary action
      console.log(data); // Log the form data to the console
    });
  }
  switchToEnable = (selector: string, index: number) => {
    this.userAccessService.userAccessesForm.controls[selector].enable();
    this.headerRefArray[index].focus();
    this.headerRefArray[index].select();
  };
  //onBlure after clicking outside of a filter we disable it again and if its empty we set value to its default
  switchToDisable = (selector: string, index: number) => {
    this.userAccessService.userAccessesForm.controls[selector].disable();
    if (
      this.userAccessService.userAccessesForm.get(selector)?.value === '' ||
      this.userAccessService.userAccessesForm.get(selector)?.value === null
    ) {
      this.userAccessService.userAccessesForm.controls[selector].setValue(
        this.userAccessService.columns[index].header
      );
    }
  };
  //depending on what column header is callig we filter the temporary table
  filterColumn = (index: number) => {
    this.userAccessService.filteredUserAccesses =
      this.userAccessService.userAccesses.filter((item) =>
        item[this.userAccessService.columns[index].dataAlias]
          .toString()
          .toLowerCase()
          .includes(
            this.userAccessService.userAccessesForm
              .get(this.userAccessService.columns[index].id)
              ?.value.toString()
              .toLowerCase()
          )
      );
  };

  addEmptyUserAccess = () => {
    //creating a new user
    let newGroup: UserAccess = {
      userId: '',
      groupId: '',
      creationDate: new Date(Date.now()),
    };

    var len = this.userAccessService.maxLength;
    //keeping track of the new controllers names
    this.userAccessService.maxLength++;
    //generating a dynamic controler name for each input
    var tempObj = {};
    tempObj['userId--' + len] = ['', Validators.required];
    tempObj['groupId--' + len] = ['', Validators.required];
    tempObj['d--' + len] = [new Date(Date.now()), Validators.required];
    this.userAccessService.addControlToTracker({
      userId: 'userId--' + len,
      groupId: 'groupId--' + len,
      creationDate: new Date(Date.now()),
    });
    //adding new controllers to formGroup
    this.userAccessService.userAccessesForm = this.fb.group({
      ...this.userAccessService.userAccessesForm.controls,
      ...tempObj,
    });
    //adding new empty users to the temporary table
    this.userAccessService.filteredUserAccesses.splice(len, 0, newGroup);
    //checking the validity because every input is empty at first
    this.dataProvider.formValidity =
      this.userAccessService.userAccessesForm.valid;
  };
  //every Column checks if the form is valid on every single change in input
  onChange = (event: any) => {
    this.dataProvider.formValidity =
      this.userAccessService.userAccessesForm.valid;
  };

  //remove userAccess from table
  removeUserAccess = (access: UserAccess, index: number) => {
    if (access.userId === '') {
      //if we are removing an empty temporary row
      let tempControlTracker = this.userAccessService.newControlTracker;
      this.userAccessService.filteredUserAccesses.splice(index, 1);
      this.userAccessService.deleteControlAtIndex(index);
      this.userAccessService.deleteControlTrackerAtIndex(index);
      this.userAccessService.maxLength--;
    } else {
      //if we are removing a userAccess
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.mode = true;
      modalRef.componentInstance.content = `Do you want to remove the relationship between ${access.userId} and ${access.groupId}?`;
      modalRef.result
        .then((result) => {
          if (result === 'ok') {
            this.userAccessService.removeUserAccess(access);
            this.userAccessService.filteredUserAccesses =
              this.userAccessService.filteredUserAccesses.filter((item) => {
                return (
                  item.groupId !== access.groupId ||
                  item.userId !== access.userId
                );
              });
          }
        })
        .catch((error) => {});
    }

    this.dataProvider.formValidity =
      this.userAccessService.userAccessesForm.valid;
  };
}

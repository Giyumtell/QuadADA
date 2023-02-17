import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { DataProviderService } from '../shared/data-provider.service';
import { User } from '../shared/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../shared/modal/modal.component';
import { UserService } from './user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {
  invalid: boolean;
  //refrence to each table header
  @ViewChildren('headerRefArray') headerRef: any;
  headerRefArray: any;

  constructor(
    public dataProvider: DataProviderService,
    public userService: UserService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.invalid = false;
  }

  ngOnInit(): void {
    //initializing variables on component creation
    this.dataProvider.activeTab = 'User';
    this.dataProvider.editMode = false;
    this.userService.generateControls();
    this.userService.initializeForm(this.userService.columns);
  }
  ngAfterViewInit() {
    //populating refArray with refrences after initialization
    this.headerRefArray = this.headerRef.map((para) => {
      return para.nativeElement;
    });
  }
  //onClick on a table header"span" we enable the input then put cursor inside and select all for ease of editing
  switchToEnable = (selector: string, index: number) => {
    this.userService.userForm.controls[selector].enable();
    this.headerRefArray[index].focus();
    this.headerRefArray[index].select();
  };
  //onBlure after clicking outside of a filter we disable it again and if its empty we set value to its default
  switchToDisable = (selector: string, index: number) => {
    this.userService.userForm.controls[selector].disable();
    if (
      this.userService.userForm.get(selector)?.value === '' ||
      this.userService.userForm.get(selector)?.value === null
    ) {
      this.userService.userForm.controls[selector].setValue(
        this.userService.columns[index].header
      );
    }
  };
  //depending on what column header is callig we filter the temporary table
  filterColumn = (index: number) => {
    this.userService.filteredUser = this.userService.users.filter((item) =>
      item[this.userService.columns[index].dataAlias]
        .toLowerCase()
        .includes(
          this.userService.userForm
            .get(this.userService.columns[index].id)
            ?.value.toLowerCase()
        )
    );
  };

  addEmptyUser = () => {
    //creating a new user
    let newUser: User = {
      userId: '',
      firstName: '',
      lastName: '',
      loginName: '',
      password: '',
      email: '',
    };

    var len = this.userService.maxLength;
    //keeping track of the new controllers names
    this.userService.newUserAdded();
    //generating a dynamic controler name for each input
    var tempObj = {};
    tempObj['userId--' + len] = ['', Validators.required];
    tempObj['firstName--' + len] = ['', Validators.required];
    tempObj['lastName--' + len] = ['', Validators.required];
    tempObj['loginName--' + len] = ['', Validators.required];
    tempObj['password--' + len] = ['', Validators.required];
    tempObj['email--' + len] = ['', Validators.required];
    this.userService.addControlToTracker({
      userId: 'userId--' + len,
      firstName: 'firstName--' + len,
      lastName: 'lastName--' + len,
      loginName: 'loginName--' + len,
      password: 'password--' + len,
      email: 'email--' + len,
    });
    //adding new controllers to formGroup
    this.userService.userForm = this.fb.group({
      ...this.userService.userForm.controls,
      ...tempObj,
    });
    //adding new empty users to the temporary table
    this.userService.filteredUser.splice(len, 0, newUser);
    //checking the validity because every input is empty at first
    this.dataProvider.formValidity = this.userService.userForm.valid;
  };
  //userId column checks if user exists on Blur event
  onBlur = (control: string) => {
    let value = this.userService.userForm.get(control).value;
    if (this.userService.indexOfUserOrFalse(value) !== false) {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.content = `${value} already defined`;
    }
  };
  //every Column checks if the form is valid on every single change in input
  onChange = () => {
    this.dataProvider.formValidity = this.userService.userForm.valid;
  };
  //remove a user from table
  removeUser = (user: User, index: number) => {
    if (user.userId === '') {
      //if we are removing an empty temporary row
      let tempControlTracker = this.userService.newControlTracker;
      this.userService.filteredUser.splice(index, 1);
      this.userService.deleteControlAtIndex(index);
      this.userService.deleteControlTrackerAtIndex(index);
      this.userService.maxLength--;
    } else {
      //if we are removing a user
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.content = `${user.userId} will be deleted. Confirm?`;
      modalRef.result
        .then((result) => {
          if (result === 'ok') {
            this.userService.removeUser(user.userId);
            this.userService.filteredUser =
              this.userService.filteredUser.filter(
                (item) => item.userId !== user.userId
              );
          }
        })
        .catch((error) => {});
    }

    this.dataProvider.formValidity = this.userService.userForm.valid;
  };
}

import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { DataProviderService } from '../shared/data-provider.service';
import { User } from '../shared/models/user';
import { ColumnDefinition } from '../shared/models/columnDefinition';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../shared/modal/modal.component';
import { UserService } from './user.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {
  newUsersArray: User[] = [];
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
    this.dataProvider.filteredUser = this.dataProvider.data.users;
    this.dataProvider.generateControls();
    this.dataProvider.initializeForm(this.userService.columns);
  }
  ngAfterViewInit() {
    //populating refArray with refrences after initialization
    this.headerRefArray = this.headerRef.map((para) => {
      return para.nativeElement;
    });
  }
  //onClick on a table header"span" we enable the input then put cursor inside and select all for ease of editing
  switchToEnable = (selector: string, index: number) => {
    this.dataProvider.userForm.controls[selector].enable();
    this.headerRefArray[index].focus();
    this.headerRefArray[index].select();
  };
  //onBlure after clicking outside of a filter we disable it again and if its empty we set value to its default
  switchToDisable = (selector: string, index: number) => {
    this.dataProvider.userForm.controls[selector].disable();
    if (
      this.dataProvider.userForm.get(selector)?.value === '' ||
      this.dataProvider.userForm.get(selector)?.value === null
    ) {
      this.dataProvider.userForm.controls[selector].setValue(
        this.userService.columns[index].header
      );
    }
  };
  //depending on what column header is callig we filter the temporary table
  filterColumn = (index: number) => {
    this.dataProvider.filteredUser = this.dataProvider.data.users.filter(
      (item) =>
        item[this.userService.columns[index].dataAlias]
          .toLowerCase()
          .includes(
            this.dataProvider.userForm
              .get(this.userService.columns[index].id)
              ?.value.toLowerCase()
          )
    );
  };
  addEmptyUser = () => {
    let newUser: User = {
      userId: '',
      firstName: '',
      lastName: '',
      loginName: '',
      password: '',
      email: '',
    };

    var len = this.userService.lenNewUserArray;
    this.userService.newUserAdded();
    var tempObj = {};
    tempObj['userId' + len] = ['', Validators.required];
    tempObj['firstName' + len] = ['', Validators.required];
    tempObj['lastName' + len] = ['', Validators.required];
    tempObj['loginName' + len] = ['', Validators.required];
    tempObj['password' + len] = ['', Validators.required];
    tempObj['email' + len] = ['', Validators.required];
    this.newUsersArray.unshift(newUser);
    this.dataProvider.userForm = this.fb.group({
      ...this.dataProvider.userForm.controls,
      ...tempObj,
    });
    this.dataProvider.filteredUser = [
      newUser,
      ...this.dataProvider.filteredUser,
    ];
    this.dataProvider.formValidity = this.dataProvider.userForm.valid;
  };
  onBlur = (control: string) => {
    if (
      this.dataProvider.indexOfUserOrFalse(
        this.dataProvider.userForm.get(control).value
      ) !== false
    ) {
      this.modalService.open(ModalComponent);
    }
  };
  onChange = () => {
    this.dataProvider.formValidity = this.dataProvider.userForm.valid;
  };
}

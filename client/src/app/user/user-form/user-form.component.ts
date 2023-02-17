import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements ControlValueAccessor {
  userForm: FormGroup = new FormGroup({});
  @Input() user: User;



  constructor(private fb: FormBuilder) { }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}


  ngOnInit(): void {
    this.intializeForm();
  }

  intializeForm() {
    this.userForm = this.fb.group({
      userId: [this.user.userId, Validators.required],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      loginName: [this.user.loginName, Validators.required],
      password: [this.user.password, Validators.required],
      email: [this.user.email, Validators.required],
    });
  }
}

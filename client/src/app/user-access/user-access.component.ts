import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../shared/data-provider.service';
import { UserAccessService } from './user-access.service';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
})
export class UserAccessComponent implements OnInit {
  constructor(
    public dataProvider: DataProviderService,
    public userAccessService: UserAccessService
  ) {}

  ngOnInit(): void {
    this.dataProvider.activeTab = 'UserAccess';
    this.dataProvider.editMode = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../shared/data-provider.service';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
})
export class UserAccessComponent implements OnInit {
  constructor(public dataProvider: DataProviderService) {}

  ngOnInit(): void {
    this.dataProvider.activeTab = 'UserAccess';
    this.dataProvider.editMode = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../shared/data-provider.service';
import { GroupService } from './group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  constructor(
    public dataProvider: DataProviderService,
    public groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.dataProvider.activeTab = 'Group';
    this.dataProvider.editMode = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../data-provider.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  //variable declarations
  constructor(private dataProvider: DataProviderService) {
    //variable initialization
  }

  ngOnInit(): void {}
  //handling switch between tabs and
  clickHandler = (page: string) => {
    this.dataProvider.activeTab = page;
  };
  //handling style class of the tabs
  getStyle = (page: string) => {
    return page === this.dataProvider.activeTab
      ? 'active text-white'
      : 'text-dark';
  };
}

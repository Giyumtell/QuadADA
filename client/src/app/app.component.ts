import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataProviderService } from './shared/data-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   *
   */
  constructor(public dataProvider: DataProviderService) {}
}

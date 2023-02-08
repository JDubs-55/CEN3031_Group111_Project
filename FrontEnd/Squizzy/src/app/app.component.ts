import { Component } from '@angular/core';
import { DeckInfoProviderService } from './deck-info-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isSideNavOpen: boolean = false;

  constructor(private flashCardController: DeckInfoProviderService){
  }

  toggleSideNav(){
    this.isSideNavOpen = !this.isSideNavOpen;
  }
}

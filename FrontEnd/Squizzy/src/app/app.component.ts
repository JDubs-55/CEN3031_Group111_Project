import { Component } from '@angular/core';
import { FlashCardControllerService } from './flash-card-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Squizzy';

  isSideNavOpen: boolean = false;

  constructor(private flashCardController: FlashCardControllerService){
  }

  toggleSideNav(){
    this.isSideNavOpen = !this.isSideNavOpen;
  }
}

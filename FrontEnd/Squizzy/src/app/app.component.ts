import { Component } from '@angular/core';
import { FlashCardControllerService } from './flash-card-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Squizzy';
  displayedDeck = "deck1";
  cardNumber = 0;

  constructor(private flashCardController: FlashCardControllerService){
    this.flashCardController.addDeck(this.displayedDeck);
    this.flashCardController.addCardFromTemplate(this.displayedDeck, "default", "Test Front Text", "Test Back Text");
  }
}

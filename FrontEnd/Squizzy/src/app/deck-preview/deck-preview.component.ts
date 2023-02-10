import { Component, Input } from '@angular/core';
import { Deck } from '../MyClasses/Deck';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-deck-preview',
  templateUrl: './deck-preview.component.html',
  styleUrls: ['./deck-preview.component.css']
})
export class DeckPreviewComponent {
  @Input() deck?: Deck;
  frontTexts: string[] = [];
  backTexts: string[] = [];
  textNumber: number = 0;

  clock: Subscription;



  constructor(){
    this.clock = interval(1000).subscribe(()=>{
      this.showNext();
    });
  }

  ngOnInit(){
    if(this.deck != undefined){
      this.frontTexts = Object.values(this.deck.cards).map(card=>card.frontText);
      this.backTexts = Object.values(this.deck.cards).map(card=>card.backText);
    }
    this.showNext();
  }
  
  ngOnDestroy(){
    this.clock.unsubscribe();
  }


  showNext(): void{
    this.textNumber = (this.textNumber + 1) % this.frontTexts.length
  }
}

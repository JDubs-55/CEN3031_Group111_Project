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
  onCardChange?: Subscription;



  constructor(){
    this.clock = interval(1000).subscribe(()=>{
      this.showNext();
    });
  }

  ngOnInit(){
    this.showNext();
    
    this.deck?.onCardsChange.subscribe(()=>{
      this.updateText();
    })
  }
  
  ngOnDestroy(){
    this.clock.unsubscribe();
    this.onCardChange?.unsubscribe();
  }


  showNext(): void{
    if(this.frontTexts.length == 0){
      this.textNumber = 0;
    }else{
      this.textNumber = (this.textNumber + 1) % this.frontTexts.length;
    }
  }

  updateText(): void{
    if(this.deck != undefined){
      this.frontTexts = Object.values(this.deck.cards).map(card=>card.frontText);
      this.backTexts = Object.values(this.deck.cards).map(card=>card.backText);
    }
  }
}

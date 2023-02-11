import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Deck } from '../MyClasses/Deck';
import { interval, Subscription, Observable } from 'rxjs';


//TODO: Write Comments
//TODO: Write Unit Tests


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

  onCardChange?: Subscription;
  static timer = interval(1000).subscribe(()=>{
    DeckPreviewComponent.deckPreviewComponents.forEach(preview=>{
      preview.showNext();
    })
  })

  static deckPreviewComponents = new Set<DeckPreviewComponent>();



  constructor(private changeDetector: ChangeDetectorRef){ }

  ngOnInit(){
    DeckPreviewComponent.deckPreviewComponents.add(this);

    this.showNext();
    
    this.deck?.onCardsChange.subscribe(()=>{
      this.updateText();
    })
  }
  
  ngOnDestroy(){
    DeckPreviewComponent.deckPreviewComponents.delete(this);

    this.onCardChange?.unsubscribe();
  }


  showNext(): void{
    if(this.frontTexts.length == 0){
      this.textNumber = 0;
    }else{
      this.textNumber = (this.textNumber + 1) % this.frontTexts.length;
    }
    this.changeDetector.detectChanges();
  }

  updateText(): void{
    if(this.deck != undefined){
      this.frontTexts = Object.values(this.deck.cards).map(card=>card.frontText);
      this.backTexts = Object.values(this.deck.cards).map(card=>card.backText);
    }
  }
}

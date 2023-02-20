import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Deck } from '../MyClasses/Deck';
import { interval, Subscription, Observable } from 'rxjs';
import { ProgramStateService } from '../program-state.service';


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

  colorClass: string = "";

  onCardChange?: Subscription;
  static timer = interval(1000).subscribe(()=>{
    DeckPreviewComponent.deckPreviewComponents.forEach(preview=>{
      preview.showNext();
    })
  })

  static deckPreviewComponents = new Set<DeckPreviewComponent>();



  constructor(private changeDetector: ChangeDetectorRef, private programState: ProgramStateService){ }

  ngOnInit(){
    DeckPreviewComponent.deckPreviewComponents.add(this);

    this.showNext();
    
    this.deck?.onCardsChange.subscribe(()=>{
      this.updateText();
    })

    this.programState.onSelectedDeckChange.subscribe((deck)=>{
      if(deck != undefined && this.deck != undefined){
        if(deck.ID == this.deck.ID){
          this.colorClass = "selected";
          return;
        }
      }
      this.colorClass = "";
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
      this.frontTexts = Object.values(this.deck.cards).map(card=>card.FrontText);
      this.backTexts = Object.values(this.deck.cards).map(card=>card.BackText);

      if(this.frontTexts.length == 0){
        this.frontTexts = ["This deck has no cards"];
        this.backTexts = ["ID: " + this.deck.ID];
      }
    }

    

    this.textNumber = this.textNumber % this.frontTexts.length;//This prevents the text number from becomming too high when a card is deleted
  }
}

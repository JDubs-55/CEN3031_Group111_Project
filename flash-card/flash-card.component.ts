import { AfterViewInit, Component, Input, HostListener, HostBinding } from '@angular/core';

import { FlashCardControllerService } from "../flash-card-controller.service"

@Component({
  selector: 'app-flash-card',
  templateUrl: './flash-card.component.html',
  styleUrls: ['./flash-card.component.css']
})
export class FlashCardComponent {

  //Reserved values for null cards
  @Input() cardNumber: number = -1;
  @Input() deckID: string = "";


  isFrontShown: boolean = true;
  animationState: string = "shown";

  //The getters allow the functions padding, frontText, and backText, to behave like read only variables
  @HostBinding("style.--padding") get padding() { 
    if(this.flashCardController.decks[this.deckID] == undefined){
      return this.flashCardController.defaultPadding;
    }
    if(this.flashCardController.decks[this.deckID].cards[this.cardNumber] == undefined){
      return this.flashCardController.defaultPadding;
    }

    return this.flashCardController.decks[this.deckID].cards[this.cardNumber].padding;
  }
  get frontText() {
    if(this.flashCardController.decks[this.deckID] == undefined){
      return this.flashCardController.defaultFrontText;
    }
    if(this.flashCardController.decks[this.deckID].cards[this.cardNumber] == undefined){
      return this.flashCardController.defaultFrontText;
    }

    return this.flashCardController.decks[this.deckID].cards[this.cardNumber].frontText;
  }
  get backText() { 
    if(this.flashCardController.decks[this.deckID] == undefined){
      return this.flashCardController.defaultBackText;
    }
    if(this.flashCardController.decks[this.deckID].cards[this.cardNumber] == undefined){
      return this.flashCardController.defaultBackText;
    }

    return this.flashCardController.decks[this.deckID].cards[this.cardNumber].backText;
  }

  get shownText(){
    if(this.isFrontShown){
      return this.frontText;
    }else{
      return this.backText;
    }
  }

  constructor(private flashCardController: FlashCardControllerService){}

  

  @HostListener('click', ['$event'])
  onClick(e: any) {
    this.flipCard();
  }

  flipCard(): void{
    this.animationState = "hidden";//This triggers a transition
  }

  midFlip(): void{//This triggers when the transition is over
    if(this.animationState == "hidden"){//Only if it faded away will it change the text
      this.isFrontShown = !this.isFrontShown;
    }

    this.animationState = "shown";//This will trigger another transition, if it was hidden before
  }
}

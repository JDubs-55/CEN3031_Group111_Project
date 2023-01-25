import { Injectable } from '@angular/core';


interface CardData {
  frontText: string;
  backText: string;
  padding: string;
}

class DeckData{
  cards: { [cardNumber: number]: CardData } = {};
  private largestCardNumber = -1;

  addCard(frontText: string | CardData, backText?: string, padding?: string): boolean{
    this.largestCardNumber += 1;

    if(typeof frontText == "string" && backText != undefined && padding != undefined){
      this.cards[this.largestCardNumber] = {
        frontText: frontText,
        backText: backText,
        padding: padding
      };
    }else if(typeof frontText != "string" && backText == undefined && padding == undefined){
      this.cards[this.largestCardNumber] = frontText;
    }else{
      throw "DeckData.addCard, Invalid parameters.";
    }
    
    return true;
  }

  deleteCard(cardNumber: number): boolean{
    if(this.cards[cardNumber] == undefined){
      console.log(`Unable to delete card. Card number ${cardNumber} does not exist.`);
      return false;
    }

    delete this.cards[cardNumber];
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FlashCardControllerService {

  defaultFrontText: string = "Default Front Text";
  defaultBackText: string = "Default Back Text";
  defaultPadding: string = "1em";

  private _decks: { [deckID: string]: DeckData } = {};

  private _templates: { [templateID: string]: CardData } = {
    "default" : {
      frontText: this.defaultFrontText,
      backText: this.defaultBackText,
      padding: this.defaultPadding
    }
  };

  constructor() {}

  get decks() {
    delete this._decks[""];
    return this._decks;
  }


  //returns the success of the operation
  addCardTemplate(templateID: string, padding: string): boolean{
    if(this._templates[templateID] != undefined){
      console.log(`Unable to add template. Another template is already registered under the ID ${templateID}`);
      return false;
    }
    this._templates[templateID] = {frontText: this.defaultFrontText, backText: this.defaultBackText, padding: padding};
    return true;
  }

  editCardTemplate(templateID: string, padding: string): boolean{
    if(this._templates[templateID] == undefined){
      console.log(`Unable to edit template. No template is registered under the ID ${templateID}`);
      return false;
    }
    this._templates[templateID] = {frontText: this.defaultFrontText, backText: this.defaultBackText, padding: padding};
    return true;
  }

  deleteCardTemplate(templateID: string): boolean{
    if(this._templates[templateID] == undefined){
      console.log(`Unable to delete template. No template is registered under the ID ${templateID}`);
      return false;
    }
    delete this._templates[templateID];
    return true;
  }



  addCard(deckID: string, frontText: string, backText: string, padding?: string): boolean{
    if(padding == undefined){
      padding = this.defaultPadding;
    }

    let deck = this.decks[deckID];
    
    if(deck == undefined){
      console.log(`Unable to add card. The deck, ${deckID}, does not exist.`)
      return false;
    }

    return deck.addCard(frontText, backText, padding);
  }

  deleteCard(deckID: string, cardNumber: number): boolean{
    let deck = this.decks[deckID];
    
    if(deck == undefined){
      console.log(`Unable to delete card. The deck, ${deckID}, does not exist, so there is nothing to remove from.`)
      return false;
    }

    return deck.deleteCard(cardNumber);
  }

  addCardFromTemplate(deckID: string, templateID: string, frontText:string, backText:string): boolean{
    let deck = this.decks[deckID];
    
    if(deck == undefined){//If the deck doesn't exist
      console.log(`Unable to add card. The deck, ${deckID}, does not exist.`)
      return false;
    }

    let template = this._templates[templateID];

    if(template == undefined){//If the template doesn't exist
      console.log(`Unable to add card. The chosen template, ${templateID}, does not exist.`);
      return false;
    }

    let card = {...template};
    
    card.frontText = frontText;
    card.backText = backText;

    return deck.addCard(card);
  }



  addDeck(deckID: string): boolean{
    if(this.decks[deckID] != undefined){
      console.log(`Unable to add deck. A deck with the ID, ${deckID}, already exists`);
      return false;
    }

    if(deckID == ""){
      return false;
    }

    this.decks[deckID] = new DeckData();
    return true;
  }

  deleteDeck(deckID: string): boolean{
    if(this.decks[deckID] == undefined){
      console.log(`Unable to delete deck. No deck is registered under the ID: ${deckID}`);
      return false;
    }
    delete this.decks[deckID];
    return true;
  }


}

import { Injectable } from '@angular/core';


interface CardData {
  frontText: string;
  backText: string;
  padding: string;
}

class DeckData {
  cards: { [cardNumber: number]: CardData } = {};
  private largestCardNumber = -1;

  addCard(frontText: string | CardData, backText?: string, padding?: string): boolean {
    if (frontText == "" && backText == "") {
      return false;
    }

    this.largestCardNumber += 1;

    if (typeof frontText == "string" && backText != undefined && padding != undefined) {
      this.cards[this.largestCardNumber] = {
        frontText: frontText,
        backText: backText,
        padding: padding
      };
    } else if (typeof frontText != "string" && backText == undefined && padding == undefined) {
      this.cards[this.largestCardNumber] = frontText;
    } else {
      throw "DeckData.addCard, Invalid parameters.";
    }

    return true;
  }

  deleteCard(cardNumber: number): boolean {
    if (this.cards[cardNumber] == undefined) {
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

//When trying to get data, there should never be delay. 
//If newer data exists but has not yet been polled for, just provide only data
//This allows the isolation of async calls
export class DeckInfoProviderService {

  defaultFrontText: string = "Default Front Text";
  defaultBackText: string = "Default Back Text";
  defaultPadding: string = "1em";

  private _decks: { [deckID: string]: DeckData } = {};

  private _templates: { [templateID: string]: CardData } = {
    "default": {
      frontText: this.defaultFrontText,
      backText: this.defaultBackText,
      padding: this.defaultPadding
    }
  };

  get deckNameList(): string[] {
    return Object.keys(this._decks);
  }

  constructor() {
    this._decks[""] = new DeckData();
    this._decks[""].addCard("This is the null deck", "This is an invalid selection", this.defaultPadding);


    this.addDeck("dummy deck 1");
    this.addDeck("dummy deck 2");
    this.addCard("dummy deck 1", "hi", "bye");
  }

  get decks() {
    return this._decks;
  }


  //returns the success of the operation
  addCardTemplate(templateID: string, padding: string): boolean {
    if (this._templates[templateID] != undefined) {
      console.log(`Unable to add template. Another template is already registered under the ID ${templateID}`);
      return false;
    }
    this._templates[templateID] = { frontText: this.defaultFrontText, backText: this.defaultBackText, padding: padding };
    return true;
  }

  editCardTemplate(templateID: string, padding: string): boolean {
    if (this._templates[templateID] == undefined) {
      console.log(`Unable to edit template. No template is registered under the ID ${templateID}`);
      return false;
    }
    this._templates[templateID] = { frontText: this.defaultFrontText, backText: this.defaultBackText, padding: padding };
    return true;
  }

  deleteCardTemplate(templateID: string): boolean {
    if (this._templates[templateID] == undefined) {
      console.log(`Unable to delete template. No template is registered under the ID ${templateID}`);
      return false;
    }
    delete this._templates[templateID];
    return true;
  }



  addCard(deckID: string, frontText: string, backText: string, padding?: string): boolean {
    if (padding == undefined) {
      padding = this.defaultPadding;
    }

    if (deckID == "") {
      return false;
    }

    let deck = this.decks[deckID];

    if (deck == undefined) {
      console.log(`Unable to add card. The deck, ${deckID}, does not exist.`)
      return false;
    }

    return deck.addCard(frontText, backText, padding);
  }

  deleteCard(deckID: string, cardNumber: number): boolean {
    if (deckID == "") {
      return false;
    }

    let deck = this.decks[deckID];

    if (deck == undefined) {
      console.log(`Unable to delete card. The deck, ${deckID}, does not exist, so there is nothing to remove from.`)
      return false;
    }

    return deck.deleteCard(cardNumber);
  }

  addCardFromTemplate(deckID: string, templateID: string, frontText: string, backText: string): boolean {
    if (deckID == "") {
      return false;
    }

    let deck = this.decks[deckID];

    if (deck == undefined) {//If the deck doesn't exist
      console.log(`Unable to add card. The deck, ${deckID}, does not exist.`)
      return false;
    }

    let template = this._templates[templateID];

    if (template == undefined) {//If the template doesn't exist
      console.log(`Unable to add card. The chosen template, ${templateID}, does not exist.`);
      return false;
    }

    let card = { ...template };

    card.frontText = frontText;
    card.backText = backText;

    return deck.addCard(card);
  }

  editCard(deckID: string, cardNumber: number, frontText?: string, backText?: string, padding?: string): boolean {


    if (deckID == "") {
      return false;
    }

    let deck = this.decks[deckID];

    if (deck == undefined) {
      console.log(`Unable to edit card. The deck, ${deckID}, does not exist.`)
      return false;
    }


    let card = deck.cards[cardNumber];



    if (card == undefined) {
      if(frontText == undefined){
        frontText = this.defaultFrontText;
      }
      if(backText == undefined){
        backText = this.defaultBackText;
      }
      if (padding == undefined) {
        padding = this.defaultPadding;
      }

      deck.cards[cardNumber] = {
        frontText: frontText,
        backText: backText,
        padding: padding
      };

      return true;
    }

    //if the cards exists to be edited
    if(frontText == undefined){
      frontText = card.frontText;
    }
    if(backText == undefined){
      backText = card.backText;
    }
    if (padding == undefined) {
      padding = card.padding;
    }

    deck.cards[cardNumber] = {
      frontText: frontText,
      backText: backText,
      padding: padding
    };


    return true;
  }


  addDeck(deckID: string): boolean {
    if (this.decks[deckID] != undefined) {
      console.log(`Unable to add deck. A deck with the ID, ${deckID}, already exists`);
      return false;
    }

    if (deckID == "") {
      return false;
    }

    this.decks[deckID] = new DeckData();
    return true;
  }

  deleteDeck(deckID: string): boolean {
    if (deckID == "") {
      console.log(`You are attempting to remove the null deck. This is not possible.`);
      return false;
    }

    if (this.decks[deckID] == undefined) {
      console.log(`Unable to delete deck. No deck is registered under the ID: ${deckID}`);
      return false;
    }
    delete this.decks[deckID];
    return true;
  }


}

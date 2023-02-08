import { Injectable } from '@angular/core';
import { Deck } from './MyClasses/Deck';



//This service interacts with the server\\

type deckID = string;
type deckName = string;


@Injectable({
  providedIn: 'root'
})
export class DeckInfoService {

  
  private deckNames = new Set<deckName>();

  private loadedDecks: {[ID: deckID]: Deck} = {};//Maps deckIDs to decks
  private decksByName: {[deckName: deckName]: deckID[]} = {};//Maps deckNames to deckIDs

  private dirtyDecks = new Set<deckID>();//A set of deckIDs for dirty decks




  constructor() { 
    //DUMMY CODE
    function makeid(length: number): string {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
  }

    for(let i = 0; i < 10; i++){
      let deck = new Deck();
      deck.ID = makeid(10);
      deck.name = "hi";
      this.putDeckIntoLoadedList(deck);
    }

    for(let i = 0; i < 10; i++){
      let deck = new Deck();
      deck.ID = makeid(10);
      deck.name = "bye";
      this.putDeckIntoLoadedList(deck);
    }

    for(let i = 0; i < 10; i++){
      let deck = new Deck();
      deck.ID = makeid(10);
      deck.name = "hi2";
      this.putDeckIntoLoadedList(deck);
    }
  } 

  //Loading functions

  //Loads a list of every name used by a deck in the database
  loadAllDeckNames(): void {
    function getFromServer(): string[]{
      return [];
    }

    this.deckNames = new Set<string>(getFromServer());
  }

  private putDeckIntoLoadedList(deck: Deck): void{
    this.loadedDecks[deck.ID] = deck;
      
    if(this.decksByName[deck.name] == undefined){
      this.decksByName[deck.name] = [];
    }
    this.decksByName[deck.name].push(deck.ID);

    this.deckNames.add(deck.name);//This exists so that new decks can be added without needed to save and reload before the deck becomes usable
  }

  //Loads a set of the decks based on a list of names that are already known to exist
  //Searches by exact match
  loadDecksByName(names: deckName[] | deckName): void{
    if(typeof names == "string"){
      return this.loadDecksByName([names]);
    }

    function getFromServer(names: string[]): Deck[]{return [];}

    let decks = getFromServer(names);

    decks.forEach(this.putDeckIntoLoadedList);
  }

  //Loads decks from the server using deck IDs
  loadDecksByID(IDs: deckID[] | deckID): void{
    if(typeof IDs == "string"){
      return this.loadDecksByID([IDs]);
    }

    function getFromServer(IDs: deckID[]): Deck[]{return [];}

    let decks = getFromServer(IDs);

    decks.forEach(this.putDeckIntoLoadedList);

  }


  //Saves all the decks that are marked dirty
  saveAll(): void{
    let decksToSave: Deck[] = [];

    this.dirtyDecks.forEach(ID=>{
      decksToSave.push(this.loadedDecks[ID]);
    });

    this.dirtyDecks.clear();


    function saveToServer(decks: Deck[]):void {}
    saveToServer(decksToSave);
  }

  saveDecksByID(IDs: deckID[] | deckID): void{
    if(typeof IDs == "string"){
      return this.saveDecksByID([IDs]);
    }

    IDs.forEach(ID=>{
      this.dirtyDecks.delete(ID);
    });
    
    function saveToServer(decks: Deck[]):void {}
    
    saveToServer(IDs.map(ID=>this.loadedDecks[ID]));
  }

  saveDecksByName(names: deckName[] | deckName): void{
    if(typeof names == "string"){
      return this.saveDecksByID([names]);
    }

    let IDs = this.getDeckIDsForNames(names);

    this.saveDecksByID(IDs);
  }


  unloadDecksByID(IDs: deckID[] | deckID, isSaving?: boolean): void{
    if(typeof IDs == "string"){
      return this.unloadDecksByID([IDs]);
    }

    if(isSaving){
      this.saveDecksByID(IDs);
    }

    IDs.forEach(ID=>{
      let deck = this.loadedDecks[ID];
      this.decksByName[deck.name] = this.decksByName[deck.name].filter(tID=>tID!=ID);//Removes the ID from the name list
      delete this.loadedDecks[ID];
      this.dirtyDecks.delete(ID);
    });
  }

  unloadDecksByName(names: deckName[] | deckName, isSaving?: boolean): void{
    if(typeof names == "string"){
      return this.unloadDecksByName([names]);
    }

    let IDs = this.getDeckIDsForNames(names);

    this.unloadDecksByID(IDs, isSaving);
  }  


  //These functions only deal with preloaded data
  getAllDeckNames(): Set<deckName>{return this.deckNames;}

  getDecksByName(targetNames: deckName[] | deckName): Deck[] {
    if(typeof targetNames == "string"){
      return this.getDecksByName([targetNames]);
    }

    
    let loadedNames = Object.keys(this.decksByName);

    //if at least one of the target names can be found inside the name of a deck, then the deck is included
    loadedNames = loadedNames.filter(deckName=>{
      return targetNames.some(targetName=>{
        return deckName.includes(targetName);
      });
    });

    let decks: Deck[] = [];

    loadedNames.forEach(name=>{
      decks = decks.concat(this.decksByName[name].map(ID=>this.loadedDecks[ID]));
    })



    return decks;
  }

  getDeckByID(ID: deckID): Deck{
    return this.loadedDecks[ID];
  }

  getDeckIDsForNames(names: deckName[] | string): deckID[]{
    if(typeof names == "string"){
      return this.getDeckIDsForNames([names]);
    }

    let IDs: string[] = [];
    names.forEach(name=>{
      IDs = IDs.concat(this.decksByName[name]);
    });
    return IDs;
  }

}

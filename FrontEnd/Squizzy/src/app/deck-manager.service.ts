import { Injectable } from '@angular/core';
import { Deck } from './MyClasses/Deck';
import { DeckData } from './MyClasses/DeckData';



//Before any decks can be loaded the frontend must request all the deck names
//Then the frontend requests decks by name (This search is expected to happen via exact match) (It doesn't have to. It could also send back more than what exact match would return.)

//When saving decks are sent back in batches


@Injectable({
  providedIn: 'root'
})
export class DeckManagerService {

  //The only time names are removed from this list, is when reloading all names or if a "load by name" does not find any decks for a given name
  //This contains all names that might be on the server as well as all loaded deck names
  private _allDeckNames: string[] = [];

  //These are for loaded data
  private _loadedDecks: { [ID: string]: Deck } = {};
  private _nameToID: { [deckName: string]: Set<string> } = {};//The keys of this object are the loaded names

  constructor() {

  }


  //This requests the backend to generate a deck
  generateDeck(): Deck {
    function queryBackend(): DeckData{
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
  
      return {
        ID: makeid(10),
        isFavorite: false,
        name: makeid(10),
        tags: [],
        cards: []
      };
    }

    let deck: DeckData = queryBackend();
    

    if (!this.allDeckNames.includes(deck.name)) {
      this._allDeckNames.push(deck.name);
    }

    this._loadedDecks[deck.ID] = new Deck(deck);//Add the new deck to the loaded decks

    //map the new deck's name to its ID
    if (this._nameToID[deck.name] == undefined) {
      this._nameToID[deck.name] = new Set<string>();
    }
    this._nameToID[deck.name].add(deck.ID);

    this.initializeCallbacks(this._loadedDecks[deck.ID]);

    return this._loadedDecks[deck.ID];
  }

  private initializeCallbacks(deck: Deck): void {
    deck.onNameChange.subscribe((names) => {
      //remove the name mapping for the old name
      if (this._nameToID[names.old] != undefined) {
        this._nameToID[names.old].delete(deck.ID);
        if (this._nameToID[names.old].size == 0) {
          delete this._nameToID[names.old];
        }
      }

      //If the name it is trying to map is not already in the mapping, then add a new entry to the map
      if (this._nameToID[names.new] == undefined) {
        this._nameToID[names.new] = new Set<string>();
      }

      this._nameToID[names.new].add(deck.ID);

      if (!this.allDeckNames.includes(names.new)) {
        this._allDeckNames.push(names.new);
      }
    })
  }

  //(Backend Requirement) This requests a list of every deck name from the backend 
  loadAllDeckNames(): void { }

  //(Backend might never get used) Not sure this function should even exist
  loadDecksByID(IDs: string[] | string, overwriteLocal?: boolean): void {
    if (typeof IDs == "string") {
      return this.loadDecksByID([IDs]);
    }

    function queryBackend(IDs: string[]): DeckData[] { return [] }

    let result = queryBackend(IDs);

    result.forEach(deck => {
      if (this._loadedDecks[deck.ID] == undefined) {
        //If a version is not alredy loaded
        this._loadedDecks[deck.ID] = new Deck(deck);
      } else {
        //If a version of the deck is already in the system
        if (overwriteLocal) {
          this._loadedDecks[deck.ID] = new Deck(deck);
        } else {
          return;
        }
      }


      //This will almost certainly never be true (but it can happen, and in that event this makes sense to do)
      if(!this._allDeckNames.includes(deck.name)){
        this._allDeckNames.push(deck.name);
      }

      //It will only get here if data was written to loadedDecks
      this.initializeCallbacks(this._loadedDecks[deck.ID]);
    })
  }

  //(Backend Requirement) This is the primary means by which the frontend will request decks 
  loadDecksByName(names: string[] | string, overwriteLocal?: boolean): void {
    if (typeof names == "string") {
      return this.loadDecksByName([names]);
    }

    function queryBackend(names: string[]): DeckData[] { return [] }

    let result = queryBackend(names);

    let unusedNames = new Set<string>(names);

    result.forEach(deck => {
      unusedNames.delete(deck.name);

      if (this._loadedDecks[deck.ID] == undefined) {
        //If a version is not alredy loaded
        this._loadedDecks[deck.ID] = new Deck(deck);
      } else {
        //If a version of the deck is already in the system
        if (overwriteLocal) {
          this._loadedDecks[deck.ID] = new Deck(deck);
        } else {
          return;
        }
      }

      //It will only get here if data was written to loadedDecks
      this.initializeCallbacks(this._loadedDecks[deck.ID]);
    });

    //Any names in unused names did not have a deck that used that name
    //all names that are not found to be unused are removed
    //A name is unsused if, it is neither in the server nor in the locally loaded decks
    this._allDeckNames = this._allDeckNames.filter(name => !unusedNames.has(name) || this._nameToID[name] != undefined);
  }

  //(Backend Requirement)
  saveDecks(IDs: string[] | string): void {
    if (typeof IDs == "string") {
      return this.saveDecks([IDs]);
    }

    function queryBackend(data: DeckData[]): void { }

    let decksToSave: DeckData[] = [];

    IDs.forEach(ID => {
      decksToSave.push(this._loadedDecks[ID].data);
    })

    queryBackend(decksToSave);
  }


  unloadDecks(IDs: string[] | string, isSaving?: boolean): void {
    if (typeof IDs == "string") {
      return this.unloadDecks([IDs]);
    }

    if (isSaving) {
      this.saveDecks(IDs);
    }

    IDs.forEach(ID => {
      let deck = this._loadedDecks[ID];

      //Remove the name to ID mapping
      this._nameToID[deck.name].delete(ID);
      if (this._nameToID[deck.name].size == 0) {
        delete this._nameToID[deck.name];
      }

      //Unload the deck
      delete this._loadedDecks[ID];
    });
  }



  //The following functions do not interact with the backend

  get allDeckNames(): readonly string[] {
    return this._allDeckNames;
  }

  get nameToID(): Readonly<{ [deckName: string]: Readonly<Set<string>> }> {
    return this._nameToID;
  }

  get loadedDecks(): Readonly<{ [ID: string]: Readonly<Deck> }>{
    return this._loadedDecks;
  }


  //Get is by exact match, search is by partial match
  //Get uses name == targetName
  //Search using name.include(targetName)

  getDeck(ID: string): Deck {
    if (this._loadedDecks[ID] == undefined) {
      throw "Attempted to get a deck that has not been loaded.";
    }
    return this._loadedDecks[ID];
  }

  getIDsByName(names: string[] | string): string[] {
    if (typeof names == "string") {
      return this.getIDsByName([names]);
    }

    let IDs: string[] = [];
    names.forEach(name => {
      let temp = this.nameToID[name];
      if (temp != undefined)
        IDs = IDs.concat(Array.from(temp))
    })
    
    //There is no way to get duplicate IDs

    return IDs;
  }

  getDecksByName(names: string[] | string): Deck[] {
    if (typeof names == "string") {
      return this.getDecksByName([names]);
    }

    return this.getIDsByName(names).map(ID => this.getDeck(ID));
  }


  searchDeckNames(targetName: string): string[] {
    return this.allDeckNames.filter(name => name.includes(targetName));
  }

  searchDecksByName(targetNames: string[] | string): Deck[]{
    if (typeof targetNames == "string") {
      return this.searchDecksByName([targetNames]);
    }

    
    let names: string[] = [];
    targetNames.forEach(targetName=>{
      names = names.concat(this.searchDeckNames(targetName));
    });

    names = names.filter((name, index)=>names.indexOf(name) === index);//remove duplicate names

    return this.getDecksByName(names);
  }

  searchIDsByName(targetNames: string[] | string): string[]{
    if (typeof targetNames == "string") {
      return this.searchIDsByName([targetNames]);
    }

    
    let names: string[] = [];
    targetNames.forEach(targetName=>{
      names = names.concat(this.searchDeckNames(targetName));
    });

    names = names.filter((name, index)=>names.indexOf(name) === index);//remove duplicate names

    return this.getIDsByName(names);
  }

}

import { Injectable } from '@angular/core';
import { Deck } from './MyClasses/Deck';
import { DeckData, isDeckData } from './MyClasses/DeckData';
import { dummyData } from './MyClasses/DummyData'
import { serverLocation } from './MyClasses/ServerLocation';



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

  private _dirtyDecks = new Set<string>();


  constructor() {

  }


  //This requests the backend to generate a deck
  async generateDeck(): Promise<Deck> {
    async function queryBackend(): Promise<DeckData> {
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
        IsFavorite: false,
        Name: "",
        Tags: [],
        Cards: []
      };
    }

    let deck: DeckData = await queryBackend();


    if (!this.allDeckNames.includes(deck.Name)) {
      this._allDeckNames.push(deck.Name);
    }

    this._loadedDecks[deck.ID] = new Deck(deck);//Add the new deck to the loaded decks

    //map the new deck's name to its ID
    if (this._nameToID[deck.Name] == undefined) {
      this._nameToID[deck.Name] = new Set<string>();
    }
    this._nameToID[deck.Name].add(deck.ID);

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
  async loadAllDeckNames(): Promise<void> {
    async function queryBackend(): Promise<string[]> {
      //return dummyData.map(deck=>deck.Name);
      let out: string[] = [];
      await fetch(serverLocation + "/api/getalldecks")
      .then(response=>response.json())
      .then(data=>{
        out = data;
      })
      return out;
    }
    let names = await queryBackend();//load all the names from the backend
    names = names.concat(Object.keys(this._nameToID));//Add all the names that are found locally

    this._allDeckNames = names.filter((name, index) => names.indexOf(name) === index);//remove duplicate names
  }

  async loadDecksByID(IDs: string[] | string, overwriteLocal?: boolean): Promise<void> {
    if (typeof IDs == "string") {
      return this.loadDecksByID([IDs]);
    }

    async function queryBackend(IDs: string[]): Promise<DeckData[]> {
      let out: DeckData[] = [];

      const calls = Array.from(IDs).map((element) => {
        return fetch(serverLocation + `/api/getdeck/${element}`)
          .then(response => response.json())
          .then(data => {
            if (!isDeckData(data)) {
              console.log("Warning this is not valid deck data: ", data);
              return;
            }

            out.push(data);
          })
      });

      await Promise.all(calls);

      return out
    }

    let result = await queryBackend(IDs);

    result.forEach(deck => {
      let addNameToList: boolean = false;

      if (this._loadedDecks[deck.ID] == undefined) {
        //If a version is not alredy loaded
        this.loadDeckHelper(deck);
        addNameToList = true;
      } else {
        //If a version of the deck is already in the system
        if (overwriteLocal) {
          this.loadDeckHelper(deck);
        } else {
          //If the name of the server does not equal the name locally, then ignore the name from the server
          //This if statement does the contrapositive
          if (this._loadedDecks[deck.ID].name == deck.Name) {
            addNameToList = true;
          }
        }
      }


      //This will almost certainly never be true (but it can happen, and in that event this makes sense to do)
      if (!this._allDeckNames.includes(deck.Name) && addNameToList) {
        this._allDeckNames.push(deck.Name);
      }

      //It will only get here if data was written to loadedDecks
      this.initializeCallbacks(this._loadedDecks[deck.ID]);
    })
  }

  async loadDecksByName(names: string[] | string, overwriteLocal?: boolean): Promise<void> {
    if (typeof names == "string") {
      return this.loadDecksByName([names]);
    }


    async function queryBackend(names: string[]): Promise<DeckData[]> {
      let out: DeckData[] = [];

      names = names.map(name => {
        return name.replaceAll(" ", "%20");
      })

      let ids: string[] = [];
      const callsForIDs = names.map(name => {
        //console.log(name);
        return fetch(serverLocation + `/api/getdecklist/${name}`)
          .then(response => response.json())
          .then(data => {
            //console.log(data);
            if(data == null){
              return;
            }
            
            Array.from(data).forEach((deck)=>{      
              if(typeof deck == "object" && deck != null && "ID" in deck && typeof deck["ID"] == "string"){
                ids.push(deck["ID"])
              }      
            })
            
              
          })
      });

      await Promise.all(callsForIDs);

      const calls = Array.from(ids).map((element) => {
        return fetch(serverLocation + `/api/getdeck/${element}`)
          .then(response => response.json())
          .then(data => {
            if (!isDeckData(data)) {
              console.log("Warning this is not valid deck data: ", data);
              return;
            }

            out.push(data);
          })
      });

      await Promise.all(calls);

      return out
    }


    let result = await queryBackend(names);
    //console.log(result);

    let unusedNames = new Set<string>(names);

    result.forEach(deck => {


      let addNameToList: boolean = false;
      let nameWasUsed: boolean = true;//This removes the server name from the searchable list, if the local name differs from the server name (And no other decks used that name)

      if (this._loadedDecks[deck.ID] == undefined) {
        //If a version is not alredy loaded
        this.loadDeckHelper(deck);
        addNameToList = true;
      } else {
        //If a version of the deck is already in the system
        if (overwriteLocal) {
          this.loadDeckHelper(deck);
        } else {
          //If the name of the server does not equal the name locally, then ignore the name from the server
          //This if statement does the contrapositive
          if (this._loadedDecks[deck.ID].name == deck.Name) {
            addNameToList = true;
          } else {
            nameWasUsed = false;
          }
        }
      }

      if (nameWasUsed) {
        unusedNames.delete(deck.Name);
      }

      if (!this._allDeckNames.includes(deck.Name) && addNameToList) {
        this._allDeckNames.push(deck.Name);
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

    function queryBackend(data: DeckData[]): void {
      
    }

    let decksToSave: DeckData[] = [];

    IDs.forEach(ID => {
      decksToSave.push(this._loadedDecks[ID].data);
      this._dirtyDecks.delete(ID);
    })

    queryBackend(decksToSave);
  }


  //(backend requirement)
  deleteDecks(IDs: string[] | string): void {
    if (typeof IDs == "string") {
      return this.deleteDecks([IDs]);
    }

    function queryBackend(data: DeckData[]): void { }

    let decksToDelete: DeckData[] = [];

    IDs.forEach(ID => {
      decksToDelete.push(this._loadedDecks[ID].data);
      this._dirtyDecks.delete(ID);
    })

    this.unloadDecks(IDs);
    queryBackend(decksToDelete);
  }
  //Warning do no use (this is a helper function for the proper loading functions)
  private loadDeckHelper(deck: DeckData): void {
    this._loadedDecks[deck.ID] = new Deck(deck);
    this._loadedDecks[deck.ID].onDirty.subscribe(() => {
      this._dirtyDecks.add(deck.ID);
    });
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
      this._dirtyDecks.delete(ID);
    });
  }

  saveDirty(): void {
    console.log("Saving Dirty", Array.from(this._dirtyDecks))
    this.saveDecks(Array.from(this._dirtyDecks));
  }



  //The following functions do not interact with the backend

  get allDeckNames(): readonly string[] {
    return this._allDeckNames;
  }

  get nameToID(): Readonly<{ [deckName: string]: Readonly<Set<string>> }> {
    return this._nameToID;
  }

  get loadedDecks(): Readonly<{ [ID: string]: Readonly<Deck> }> {
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
    return this.allDeckNames.filter(name => name.toLowerCase().includes(targetName.toLowerCase()));
  }

  searchDecksByName(targetNames: string[] | string): Deck[] {
    if (typeof targetNames == "string") {
      return this.searchDecksByName([targetNames]);
    }


    let names: string[] = [];
    targetNames.forEach(targetName => {
      names = names.concat(this.searchDeckNames(targetName));
    });

    names = names.filter((name, index) => names.indexOf(name) === index);//remove duplicate names

    return this.getDecksByName(names);
  }

  searchIDsByName(targetNames: string[] | string): string[] {
    if (typeof targetNames == "string") {
      return this.searchIDsByName([targetNames]);
    }


    let names: string[] = [];
    targetNames.forEach(targetName => {
      names = names.concat(this.searchDeckNames(targetName));
    });

    names = names.filter((name, index) => names.indexOf(name) === index);//remove duplicate names

    return this.getIDsByName(names);
  }

}


import { Injectable } from '@angular/core';
import { Deck } from './MyClasses/Deck';
import { DeckData, isDeckData } from './MyClasses/DeckData';
import { dummyData } from './MyClasses/DummyData'
import { serverLocation } from './MyClasses/ServerLocation';
import { Observable, Subject } from "rxjs";



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
  private _onUnloadSubject = new Subject();


  constructor() {

  }


  //This requests the backend to generate a deck
  async generateDeck(): Promise<Deck> {
    async function queryBackend(): Promise<DeckData> {

      let out: DeckData;
      let ID: string = "";

      await fetch(serverLocation + "/api/createdeck")
        .then(response => response.json())
        .then(data => {
          ID = data.id;
        })

      //console.log(ID)
      await fetch(serverLocation + `/api/getdeck/${ID}`)
        .then(response => response.json())
        .then(data => {
          out = data;
        })

      //@ts-ignore
      return out;
    }

    let deck: DeckData = await queryBackend();

    if (!isDeckData(deck)) {
      console.log("Warning this is not valid deck data: ", deck);
    }

    if (!this.allDeckNames.includes(deck.name)) {
      this._allDeckNames.push(deck.name);
    }

    this._loadedDecks[deck.id] = new Deck(deck);//Add the new deck to the loaded decks

    //map the new deck's name to its ID
    if (this._nameToID[deck.name] == undefined) {
      this._nameToID[deck.name] = new Set<string>();
    }
    this._nameToID[deck.name].add(deck.id);

    this.initializeCallbacks(this._loadedDecks[deck.id]);


    this._loadedDecks[deck.id].name = "Default Name"
    //console.log("Generate DeckL ", deck)

    return this._loadedDecks[deck.id];
  }

  private initializeCallbacks(deck: Deck): void {

    //When the name of a deck changes the following need to happen
    deck.onNameChange.subscribe((names) => {
      //remove the name mapping for the old name
      if (this._nameToID[names.old] != undefined) {
        this._nameToID[names.old].delete(deck.ID);
        if (this._nameToID[names.old].size == 0) {
          delete this._nameToID[names.old];
        }
      }

      //If the name it is trying to add is not already in the mapping, then add a new name to the map
      if (this._nameToID[names.new] == undefined) {
        this._nameToID[names.new] = new Set<string>();
      }

      //Add the name, id pair to the map
      this._nameToID[names.new].add(deck.ID);

      //If the new name is not found in the list of all deck names, then add it to the list of all names
      if (!this.allDeckNames.includes(names.new)) {
        this._allDeckNames.push(names.new);
      }
    })


    //When any aspect of the deck changes the following needs to happen
    deck.onDirty.subscribe(() => {
      //Add the deck to the list of decks that have had something changed
      this._dirtyDecks.add(deck.ID);
    });
  }

  //(Backend Requirement) This requests a list of every deck name from the backend 
  async loadAllDeckNames(): Promise<void> {

    async function queryBackend(): Promise<string[]> {
      let out: string[] = [];
      //This line requests a list of every deck name stored in the back end
      await fetch(serverLocation + "/api/getalldecks")
        .then(response => response.json())
        .then(data => {
          out = data;
        })

      //console.log(out);
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

      //This line requests the back end to load each deck one at a time
      const calls = Array.from(IDs).map((element) => {
        return fetch(serverLocation + `/api/getdeck/${element}`)
          .then(response => response.json())
          .then(data => {
            //This line ensures that the data sent over is actually a deck. And it repairs the data if it has the correct structure but not all the values are defined
            if (!isDeckData(data)) {
              console.log("Warning this is not valid deck data: ", data);
              return;
            }

            out.push(data);
          })
      });

      await Promise.all(calls);//This waits for the decks to be loaded

      return out
    }

    let result = await queryBackend(IDs);//This gets the deck data

    //For each deck there are a few things that need to happen
    result.forEach(deck => {
      this.loadDeck(deck, overwriteLocal);
    })
  }

  async loadDecksByName(names: string[] | string, overwriteLocal?: boolean): Promise<void> {
    if (typeof names == "string") {
      return this.loadDecksByName([names]);
    }


    async function queryBackend(names: string[]): Promise<DeckData[]> {
      let out: DeckData[] = [];

      //Alters the names so that they can be queried for
      names = names.map(name => {
        return name.replaceAll(" ", "%20");
      })


      let ids: string[] = [];
      //This gets the list of deck IDs that need to be loaded
      const callsForIDs = names.map(name => {
        //This sends a request for all the deck IDs that belong to decks with the target name
        //This happens for every name in the "names" variable
        return fetch(serverLocation + `/api/getdecklist/${name}`)
          .then(response => response.json())
          .then(data => {
            if (data == null) {
              return;
            }
            Array.from(data).forEach((deck) => {
              //This line just lets typescript know that the operation inside the if-statement is possible
              if (typeof deck == "object" && deck != null && "id" in deck && typeof deck["id"] == "string") {
                ids.push(deck["id"])
              }
            })


          })
      });


      await Promise.all(callsForIDs);//This waits for all the needed IDs to be loaded

      //console.log(ids)

      //This is where the deck data is actually loaded
      const calls = Array.from(ids).map((element) => {
        //This queries the back end for each deck ID that was found
        return fetch(serverLocation + `/api/getdeck/${element}`)
          .then(response => response.json())
          .then(data => {
            //This line ensures that the data sent over is actually a deck. And it repairs the data if it has the correct structure but not all the values are defined
            if (!isDeckData(data)) {
              console.log("Warning this is not valid deck data: ", data);
              return;
            }

            out.push(data);
          })
      });

      await Promise.all(calls);//This waits for all the decks to load

      return out
    }


    let result = await queryBackend(names);//This waits for the resond from the back end


    //This variable becomes a list of the names that were queried for but not found
    let unusedNames = new Set<string>(names);

    result.forEach(deck => {
      unusedNames.delete(deck.name);//Remove the name of the deck from the set of unused names
      this.loadDeck(deck, overwriteLocal);
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
      //For each deck. Tell the deck to overwrite the existing data with the new data
      data.forEach(deck => {
        console.log("Saving: " + deck.id);

        fetch(serverLocation + `/api/updatedeck/${deck.id}`, {
          method: "PUT",
          body: JSON.stringify(deck)
        })
      })
    }

    let decksToSave: DeckData[] = [];

    //Extract the data that needs to be saved. And remove the decks from the list of decks that have been changed.
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

    function queryBackend(data: DeckData[]): void {
      data.forEach(deck => {
        fetch(serverLocation + `/api/removedeck/${deck.id}`, { method: "DELETE" })
      })
    }

    let decksToDelete: DeckData[] = [];

    //Extract the data that needs to be deleted. And removes the decks from the list of decks that have been changed. (as they will no longer exist)
    IDs.forEach(ID => {
      decksToDelete.push(this._loadedDecks[ID].data);
      this._dirtyDecks.delete(ID);
    })

    this.unloadDecks(IDs);//The decks are unloaded locally so that the front end matches the back end
    queryBackend(decksToDelete);
  }
  //Warning do no use (this is a helper function for the proper loading functions)

  unloadDecks(IDs: string[] | string, isSaving?: boolean): void {
    if (typeof IDs == "string") {
      return this.unloadDecks([IDs]);
    }

    if (isSaving) {
      this.saveDecks(IDs);
    }

    //For each deck that needs to be unloaded
    IDs.forEach(ID => {
      let deck = this._loadedDecks[ID];

      //Remove the name to ID mapping
      this._nameToID[deck.name].delete(ID);
      if (this._nameToID[deck.name].size == 0) {
        delete this._nameToID[deck.name];
      }

      //Unload the deck
      delete this._loadedDecks[ID];
      this._dirtyDecks.delete(ID);//The deck is no longer in a state where it has been changed. The changes have either been saved already, or have been ignored.
      this._onUnloadSubject.next(deck);//Trigger the onUnload event passing in the deck that was unloaded
    });
  }

  //This saves all the decks that have been changed
  saveDirty(): void {
    console.log("Saving Dirty", Array.from(this._dirtyDecks))
    this.saveDecks(Array.from(this._dirtyDecks));
  }

  //This loads deck data into the program
  loadDeck(deck: DeckData, overwriteLocal?: boolean): void {
    //If the deck already has a local version and we are not overwriting local data, then abort the load
    if (this._loadedDecks[deck.id] != undefined && !overwriteLocal) {
      return;
    }

    //If the name of the deck is not in the list of all deck names, then add the new name
    if (!this.allDeckNames.includes(deck.name)) {
      this._allDeckNames.push(deck.name);
    }

    //Put the deck into the loaded deck list
    this._loadedDecks[deck.id] = new Deck(deck);

    //Initialize the call backs so that the program will respond to changes in the deck correctly
    this.initializeCallbacks(this._loadedDecks[deck.id]);
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
    if(targetName == null){
      targetName = "";
    }
    return this.allDeckNames.filter(name => name.toLowerCase().includes(targetName.toLowerCase()));
  }

  searchDecksByName(targetNames: string[] | string): Deck[] {
    if(targetNames == null){
      targetNames = []
    }

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
    if(targetNames == null){
      targetNames = []
    }

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

  get onUnloadDeck(): Observable<any> {
    return this._onUnloadSubject.asObservable();
  }

}


import { CardData, PartialCardData } from "./CardData";
import { DeckData } from "./DeckData";
import { BehaviorSubject, Observable } from "rxjs";


export class Deck{
    private _id: string;
    private _isFavorite: BehaviorSubject<boolean>;
    private _name: BehaviorSubject<string>;
    private _tags: Set<string>;
    private _cards: {[ID: string]: CardData};


    private _tagsSubject: BehaviorSubject<Set<string>>;
    private _cardsSubject: BehaviorSubject<{[ID: string]: CardData}>;


    constructor(deckData: DeckData){
        this._id = deckData.ID;
        this._isFavorite = new BehaviorSubject<boolean>(deckData.isFavorite);
        this._name = new BehaviorSubject<string>(deckData.name);
        this._tags = new Set<string>(deckData.tags);
        this._cards = {};
        deckData.cards.forEach(card=>{
            this._cards[card.ID] = card;
        });

        this._tagsSubject = new BehaviorSubject<Set<string>>(this._tags);
        this._cardsSubject = new BehaviorSubject<{[ID: string]: CardData}>(this._cards);
    }
    

    //This is the only place where calls to the backend to generate a new deck are found
    static NewDeck(): Deck{
        //Placeholder function
        function requestServerToMakeNewDeck(): DeckData{
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
                name: "default deck name",
                tags: [],
                cards: []
            }
        }

        return new Deck(requestServerToMakeNewDeck());
    }

    //isFavorite may be changed directly
    get isFavorite(): boolean{
        return this._isFavorite.value;
    }

    set isFavorite(value: boolean){
        if(value != this.isFavorite){
            this._isFavorite.next(value);
        }
    }

    //name may be changed directly
    get name(): string{
        return this._name.value;
    }

    set name(value: string){
        if(value != this.name){//If a change actually occurs
            this._name.next(value);
        }
    }

    //tags may not be changed directly
    get tags(): Readonly<Set<string>>{
        return this._tags;
    }

    //cards may not be changed directly
    get cards(): Readonly<{[ID: string]: Readonly<CardData>}>{
        return this._cards;
    }

    //ID may not be changed directly
    get ID(): string{
        return this._id;
    }


    addTag(tag: string): void{
        this._tags.add(tag);
        this._tagsSubject.next(this._tags);
    }

    removeTag(tag: string): void{
        this._tags.delete(tag);
        this._tagsSubject.next(this._tags);
    }

    addCard(card: CardData): void{
        if(this._cards[card.ID] != undefined){
            console.log("Unable to add card: A card with this ID already exists.");
            return;
        }

        this._cards[card.ID] = card;
        this._cardsSubject.next(this._cards);
    }

    removeCard(card: PartialCardData): void{
        if(this._cards[card.ID] == undefined){
            console.log("Unable to remove card: A card with this ID does not exists.");
            return;
        }

        delete this._cards[card.ID];
        this._cardsSubject.next(this._cards);
    }

    editCard(card: PartialCardData): void{
        if(this._cards[card.ID] == undefined){
            console.log("Unable to edit card: A card with this ID does not exists.");
            return;
        }

        let somethingChanged: boolean = false;

        let k: keyof CardData;//Based on the type checker. k can only refer to properties that exist in Card Data
        for(k in card){
            if(card[k] != undefined){//Thus if PartialCard data has a non-undefined property, that property must also exist in Card Data
                if(k != "ID" && this._cards[card.ID][k] != card[k]){
                    somethingChanged = true;
                }
                
                //The comment below disables type checking for the line below it. This is done because typescript doesn't know that it is only possible to valid operations to occur
                //@ts-ignore
                this._cards[card.ID][k] = card[k];
            }
        }

        if(somethingChanged){
            this._cardsSubject.next(this._cards);
        }
    }


    get onNameChange(): Observable<string>{
        return this._name.asObservable();
    }

    get onFavoriteChange(): Observable<boolean>{
        return this._isFavorite.asObservable();
    }

    get onTagsChange(): Observable<Set<string>>{
        return this._tagsSubject.asObservable();
    }

    get onCardsChange(): Observable<{[ID: string]: CardData}>{
        return this._cardsSubject.asObservable();
    }


    get data(): Readonly<DeckData>{
        return {
            ID: this.ID,
            isFavorite: this.isFavorite,
            name: this.name,
            tags: Array.from(this._tags),
            cards: Object.values(this.cards)
        }
    }

}
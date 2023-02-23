import { CardData, PartialCardData } from "./CardData";
import { DeckData } from "./DeckData";
import { BehaviorSubject, Observable, Subject } from "rxjs";


export class Deck{
    private _id: string;
    private _isFavorite: BehaviorSubject<boolean>;
    private _name: string;
    private _tags: Set<string>;
    private _cards: {[ID: string]: CardData};


    private _tagsSubject: BehaviorSubject<Set<string>>;
    private _cardsSubject: BehaviorSubject<{[ID: string]: CardData}>;
    private _nameSubject: BehaviorSubject<{old:string, new:string}>;
    private _isDirtySubject = new Subject();



    constructor(deckData: DeckData){
        this._id = deckData.id;
        this._isFavorite = new BehaviorSubject<boolean>(deckData.isFavorite);
        this._name = deckData.name;
        this._tags = new Set<string>(deckData.tags);
        this._cards = {};
        deckData.cards.forEach(card=>{
            this._cards[card.id] = card;
        });

        this._tagsSubject = new BehaviorSubject<Set<string>>(this._tags);
        this._cardsSubject = new BehaviorSubject<{[ID: string]: CardData}>(this._cards);
        this._nameSubject = new BehaviorSubject<{old:string, new:string}>({old: this._name, new: this._name});

        //sets up the is dirty subject
        this.onCardsChange.subscribe(()=>{
            this._isDirtySubject.next(null);
        });

        this.onTagsChange.subscribe(()=>{
            this._isDirtySubject.next(null);
        });

        this.onNameChange.subscribe(()=>{
            this._isDirtySubject.next(null);
        });

        this.onFavoriteChange.subscribe(()=>{
            this._isDirtySubject.next(null);
        });
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
        return this._name;
    }

    set name(value: string){
        if(value != this.name){//If a change actually occurs
            this._nameSubject.next({
                old: this._name,
                new: value
            });
            this._name = value;
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

    addCard(): CardData{

        function makeid(length: number): string {
            let result: string = '';
            const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength: number = characters.length;
            let counter = 0;
            while (counter < length) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }
            return result;
        }

        
        let i = 1;
        let newID: string = makeid(i);
        while(this._cards[newID] != undefined){
            newID = makeid(i++);
        }
        
        this._cards[newID] = {
            id: newID,
            frontText: "Default Front",
            backText: "Default Back",
            isFavorite: false
        };
        this._cardsSubject.next(this._cards);

        return this._cards[newID];
    }

    removeCard(card: PartialCardData): void{
        if(this._cards[card.id] == undefined){
            console.log("Unable to remove card: A card with this ID does not exists.");
            return;
        }

        delete this._cards[card.id];
        this._cardsSubject.next(this._cards);
    }

    editCard(card: PartialCardData): void{
        if(this._cards[card.id] == undefined){
            console.log("Unable to edit card: A card with this ID does not exists.");
            return;
        }

        let somethingChanged: boolean = false;

        let k: keyof CardData;//Based on the type checker. k can only refer to properties that exist in Card Data
        for(k in card){
            if(card[k] != undefined){//Thus if PartialCard data has a non-undefined property, that property must also exist in Card Data
                if(k != "id" && this._cards[card.id][k] != card[k]){
                    somethingChanged = true;
                }
                
                //The comment below disables type checking for the line below it. This is done because typescript doesn't know that it is only possible to valid operations to occur
                //@ts-ignore
                this._cards[card.id][k] = card[k];
            }
        }

        if(somethingChanged){
            this._cardsSubject.next(this._cards);
        }
    }


    get onNameChange(): Observable<{old:string, new:string}>{
        return this._nameSubject.asObservable();
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
            id: this.ID,
            isFavorite: this.isFavorite,
            name: this.name,
            tags: Array.from(this._tags),
            cards: Object.values(this.cards)
        }
    }

    get onDirty(): Observable<any>{
        return this._isDirtySubject.asObservable();
    }

}
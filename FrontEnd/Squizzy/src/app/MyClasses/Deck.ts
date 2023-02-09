
import { Card } from "./Card";


export class Deck{
    ID: string = "";
    name: string = "";
    tags: string = "";
    isFavorite: boolean = false;
    cards: Card[] = [];
    isPublic: boolean = true;

    
    getCardByID(ID: string): Card | undefined{
        return this.cards.find(card=>card.ID == ID);
    }

    getCardIDs(): string[]{
        return this.cards.map(card=>card.ID);
    }
}
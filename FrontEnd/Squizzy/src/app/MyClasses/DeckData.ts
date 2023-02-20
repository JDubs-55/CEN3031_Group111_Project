import { CardData, isCardData } from "./CardData";



export function isDeckData(object: Object): boolean{
    let hasID = "ID" in object;
    let hasIsFavorite = "IsFavorite" in object;
    let hasName = "Name" in object;
    let hasTags = "Tags" in object;
    let hasCards = "Cards" in object;

    let allCardsAreValid = false;

    if(hasCards){
        //@ts-ignore
        allCardsAreValid = Object.values(object["Cards"]).every(card=>isCardData(card))
    }
    
    return hasName && hasTags && hasID && hasIsFavorite && hasCards && allCardsAreValid;
}


export interface DeckData{
    ID: string;
    IsFavorite: boolean;
    Name: string;
    Tags: string[];
    Cards: CardData[];
}

import { CardData, isCardData } from "./CardData";



export function isDeckData(object: Object): boolean{
    let hasID = "id" in object;
    let hasIsFavorite = "isFavorite" in object;
    let hasName = "name" in object;
    let hasTags = "tags" in object;
    let hasCards = "cards" in object;

    let allCardsAreValid = false;

    

    if(hasCards){
        //Ensure the the cards variable is an array
        //@ts-ignore
        if(object["cards"] == null){
            //@ts-ignore
            object["cards"] = [];
        }
        //@ts-ignore
        allCardsAreValid = Object.values(object["cards"]).every(card=>isCardData(card))
    }

    //Ensure the the tags variable is an array
    //@ts-ignore
    if(hasTags && object["tags"] == null){
        //@ts-ignore
        object["tags"] = [];
    }
    
    return hasName && hasTags && hasID && hasIsFavorite && hasCards && allCardsAreValid;
}


export interface DeckData{
    id: string;
    isFavorite: boolean;
    name: string;
    tags: string[];
    cards: CardData[];
}

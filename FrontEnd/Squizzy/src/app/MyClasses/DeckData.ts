import { CardData } from "./CardData";



export interface DeckData{
    ID: string;
    isFavorite: boolean;
    name: string;
    tags: string[];
    cards: CardData[];
}

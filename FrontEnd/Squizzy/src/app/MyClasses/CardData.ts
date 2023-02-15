

export interface CardData{
    frontText: string;
    backText: string;
    ID: string;
    isFavorite: boolean;
}


export interface PartialCardData{
    frontText?: string;
    backText?: string;
    ID: string;
    isFavorite?: boolean;
}
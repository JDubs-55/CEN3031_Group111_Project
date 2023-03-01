

export function isCardData(object: Object): boolean{
    let hasFrontText = "frontText" in object;
    let hasBackText = "backText" in object;
    let hasID = "id" in object;
    let hasIsFavorite = "isFavorite" in object;

    return hasFrontText && hasBackText && hasID && hasIsFavorite;
}

export interface CardData{
    frontText: string;
    backText: string;
    id: string;
    isFavorite: boolean;
}


export interface PartialCardData{
    frontText?: string;
    backText?: string;
    id: string;
    isFavorite?: boolean;
}
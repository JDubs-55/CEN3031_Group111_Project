

export function isCardData(object: Object): boolean{
    let hasFrontText = "FrontText" in object;
    let hasBackText = "BackText" in object;
    let hasID = "ID" in object;
    let hasIsFavorite = "IsFavorite" in object;

    return hasFrontText && hasBackText && hasID && hasIsFavorite;
}

export interface CardData{
    FrontText: string;
    BackText: string;
    ID: string;
    IsFavorite: boolean;
}


export interface PartialCardData{
    FrontText?: string;
    BackText?: string;
    ID: string;
    IsFavorite?: boolean;
}
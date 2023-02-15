import { BehaviorSubject } from 'rxjs';
import { Deck } from './Deck';
import { DeckData } from './DeckData';

describe('Deck', () => {

    let defaultData: DeckData = {
        ID: "01",
        isFavorite: true,
        name: "this is a name",
        tags: ["tag 1", "tag1"],
        cards: [{
            ID: "01",
            isFavorite: false,
            frontText: "front",
            backText: "back"
        }, {
            ID: "02",
            isFavorite: true,
            frontText: "front2",
            backText: "back2"
        }]
    };

    beforeEach(()=>{
        defaultData = {
            ID: "01",
            isFavorite: true,
            name: "this is a name",
            tags: ["tag 1", "tag1"],
            cards: [{
                ID: "01",
                isFavorite: false,
                frontText: "front",
                backText: "back"
            }, {
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }]
        }
    })

    it("Should be able to load from deck data", () => {
        let deck = new Deck(defaultData);

        //This uses the getter, so this is testing the getters
        expect(deck.data).toEqual(defaultData);
    })


    it("Should be able to edit cards", ()=>{
        let deck = new Deck(defaultData);
        deck.editCard({ID:"01", frontText: "changed front text", backText: "changed back text", isFavorite: true});

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.cards).toEqual({
            "01": {
                ID: "01",
                isFavorite: true,
                frontText: "changed front text",
                backText: "changed back text"
            },
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }
        });

    })

    it("Should be able to partially edit cards", ()=>{
        let deck = new Deck(defaultData);
        deck.editCard({ID:"01", frontText: "changed front text"});

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.cards).toEqual({
            "01": {
                ID: "01",
                isFavorite: false,
                frontText: "changed front text",
                backText: "back"
            },
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }
        });

    })


    it("Should be able to add tags", ()=>{
        let deck = new Deck(defaultData);
        deck.addTag("hi");

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1", "hi"]));
        expect(deck.cards).toEqual({
            "01": {
                ID: "01",
                isFavorite: false,
                frontText: "front",
                backText: "back"
            },
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }
        });

    })

    it("Should be able to remove tags", ()=>{
        let deck = new Deck(defaultData);
        deck.removeTag("tag1");

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1"]));
        expect(deck.cards).toEqual({
            "01": {
                ID: "01",
                isFavorite: false,
                frontText: "front",
                backText: "back"
            },
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }
        });

    })

    it("Should be able to add cards", ()=>{
        let deck = new Deck(defaultData);
        deck.addCard({
            frontText: "new Front",
            backText: "new Back",
            ID:"aisrhoa",
            isFavorite: false
        });

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.cards).toEqual({
            "01": {
                ID: "01",
                isFavorite: false,
                frontText: "front",
                backText: "back"
            },
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            },
            "aisrhoa":{
                frontText: "new Front",
                backText: "new Back",
                ID:"aisrhoa",
                isFavorite: false
            }
        });

    })

    it("Should be able to remove cards", ()=>{
        let deck = new Deck(defaultData);
        deck.removeCard({
            ID: "01"
        });

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.cards).toEqual({
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }
        });

    })

    it("Should be able to set the name of a deck", ()=>{
        let deck = new Deck(defaultData);
        deck.name = "new name"

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("new name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.cards).toEqual({
            "01":{
                ID: "01",
                isFavorite: false,
                frontText: "front",
                backText: "back"
            },
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }
        });
    })

    it("Should be able to set the favorite status of a deck", ()=>{
        let deck = new Deck(defaultData);
        deck.isFavorite = false;

        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(false);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.cards).toEqual({
            "01":{
                ID: "01",
                isFavorite: false,
                frontText: "front",
                backText: "back"
            },
            "02":{
                ID: "02",
                isFavorite: true,
                frontText: "front2",
                backText: "back2"
            }
        });
    })





});
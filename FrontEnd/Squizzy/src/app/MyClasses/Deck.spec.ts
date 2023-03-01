import { BehaviorSubject } from 'rxjs';
import { Deck } from './Deck';
import { DeckData } from './DeckData';

describe('Deck', () => {

    let defaultData: DeckData = {
        id: "01",
        isFavorite: true,
        name: "this is a name",
        tags: ["tag 1", "tag1"],
        cards: [{
            id: "01",
            isFavorite: false,
            frontText: "front",
            backText: "back"
        }, {
            id: "02",
            isFavorite: true,
            frontText: "front2",
            backText: "back2"
        }]
    };

    let testData: DeckData = {
        id: "02",
        isFavorite: true,
        name: "this is a name",
        tags: ["tag 1", "tag1"],
        cards: [{
            id: "01",
            isFavorite: true,
            frontText: "changed front text",
            backText: "changed back text"
        }, {
            id: "02",
            isFavorite: true,
            frontText: "front2",
            backText: "back2"
        }]
    };
    
    let test2Data: DeckData = {
        id: "03",
        isFavorite: true,
        name: "this is a name",
        tags: ["tag 1", "tag1"],
        cards: [{
            id: "01",
            isFavorite: false,
            frontText: "front",
            backText: "back"
        }, {
            id: "02",
            isFavorite: true,
            frontText: "front2",
            backText: "back2"
        }, {
            id: "aisrhoa",
            isFavorite: false,
            frontText: "new Front",
            backText: "new Back"
        },]
    }

    beforeEach(()=>{
        defaultData = {
            id: "01",
            isFavorite: true,
            name: "this is a name",
            tags: ["tag 1", "tag1"],
            cards: [{
                id: "01",
                isFavorite: false,
                frontText: "front",
                backText: "back"
            }, {
                id: "02",
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


    it("Should be able to change favorite status of a deck", () => {
        let deck = new Deck(defaultData);
        //test default value
        expect(deck.isFavorite).toEqual(true);
        //toggles isFavorite
        deck.isFavorite = false;
        //checks all default values of deck, then if favorite toggled
        expect(deck.ID).toEqual("01");
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.isFavorite).toEqual(false);
    })

    it("Should be able to change name directly", () => {
        let deck = new Deck(defaultData);
        //directly changes deck name
        deck.name = "test";
        //checks all default values of deck, then if name changed
        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        expect(deck.name).toEqual("test");
    })

    it("Should be able to add tags", ()=>{
        let deck = new Deck(defaultData);
        //directly changes deck tags
        deck.addTag("hi");
        //checks all default values of deck, then if tags changed
        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag 1", "tag1", "hi"]));
    })

    it("Should be able to remove tags", ()=>{
        //directly removes tag then tests
        let deck = new Deck(defaultData);
        deck.removeTag("tag 1");
        //checks all default values of deck, then if tags changed
        expect(deck.ID).toEqual("01");
        expect(deck.isFavorite).toEqual(true);
        expect(deck.name).toEqual("this is a name");
        expect(deck.tags).toEqual(new Set<string>(["tag1"]));
    })

    it("Should be able to edit cards including individual favorite status", ()=>{
        let deck1 = new Deck(defaultData);
        let deck2 = new Deck(testData);
        //change deck 1 card info to be equivalent to deck 2
        deck1.editCard({id:"01", frontText: "changed front text", backText: "changed back text", isFavorite: true});
        //finally compare all cards of deck1 to deck2
        expect(deck1.cards).toEqual(deck2.cards);
    });

    it("Should be able to partially edit cards", ()=>{
        let deck1 = new Deck(defaultData);
        let deck2 = new Deck(testData);
        //change deck 1 card info to be equivalent to deck 2 in two partial calls
        deck1.editCard({id:"01", frontText: "changed front text", isFavorite: true});
        deck1.editCard({id:"01", backText: "changed back text"});
        //compare all cards of deck1 to all in deck2
        expect(deck1.cards).toEqual(deck2.cards);
    })
    
    it("Should be able to add cards", ()=>{
        let deck1 = new Deck(defaultData);
        let deck2 = new Deck(test2Data);
        //add card to deck1
        deck1.addCard({
            frontText: "new Front",
            backText: "new Back",
            id:"aisrhoa",
            isFavorite: false 
        })
        //check deck1 default info
        expect(deck1.ID).toEqual("01");
        expect(deck1.isFavorite).toEqual(true);
        expect(deck1.name).toEqual("this is a name");
        expect(deck1.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        //compare deck1 with new card to expected value of deck2
        expect(deck1.cards).toEqual(deck2.cards);
    })

    it("Should be able to remove cards", ()=>{
        let deck1 = new Deck(test2Data);
        let deck2 = new Deck(defaultData);
        //remove third card from deck1
        deck1.removeCard({id: "aisrhoa"});
        //check deck1 default info
        expect(deck1.ID).toEqual("03");
        expect(deck1.isFavorite).toEqual(true);
        expect(deck1.name).toEqual("this is a name");
        expect(deck1.tags).toEqual(new Set<string>(["tag 1", "tag1"]));
        //compare deck1 to expected value of deck2
        expect(deck1.cards).toEqual(deck2.cards);
    });
});
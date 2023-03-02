describe('deck editor spec', () => {

  function searchName(deckName: string){
    return cy.get("app-selected-deck-display input[placeholder='Deck Name']").type(deckName)
  }

  function selectDeck(deckID: string){
    return cy.get("app-deck-preview#deck" + deckID).click();
  }

  function selectCard(frontText: string, backText: string){
    return cy.get("app-card-selector .cardPreview").contains(frontText + " " + backText).click();
  }

  function selectDeckNameInput(){
    return cy.get("#EditorDiv input[placeholder='Deck Name']")
  }

  function selectFrontTextInput(){
    return cy.get("input[placeholder='Front Text']")
  }

  function selectBackTextInput(){
    return cy.get("input[placeholder='Back Text']")
  }

  beforeEach(() => {
    // run these tests as if in a desktop
    // browser with a 720p monitor
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:4200')
    cy.get("a[href='/DeckEditor']").click();
  })
  
  it('Can edit deck', () => {
    searchName("My Deck")
    cy.wait(15000);
    cy.get('input').type('{enter}')
    cy.get("app-deck-preview").click();

    selectDeckNameInput().invoke("val").then(input=>{
      if(input == "My Deck 2"){
        selectDeckNameInput().clear().type("My Deck 10");
      }else{
        selectDeckNameInput().clear().type("My Deck 2");
      }
    })
    
    

    selectCard("front2", "back2").click();
    selectFrontTextInput().clear().type("New Front Text")
    selectBackTextInput().clear().type("New Back Text")

    selectCard("front", "back").click();
    selectFrontTextInput().clear().type("HI")
    selectBackTextInput().clear().type("BYE")


    cy.get(".cardPreview").then(input=>{
      if(input.length == 3){
        selectCard("front3", "back3").click()
        cy.get("button").contains("Remove Card").click();
      }else{
        cy.get("button").contains("New Card").click();
        selectFrontTextInput().type("A new card's front text");
        selectBackTextInput().type("A new card's back text");
      }
    })

    cy.get("button").contains("Save Deck").click();
  })
})
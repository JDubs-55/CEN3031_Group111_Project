# Squizzy

**Project Name**: 
Squizzy


**Project Description**:
Our project will be a flashcard application that allows users to create quiz decks, quiz themselves, and share their decks with others. Users will be able to:
 - Create decks of flash cards
 - Add their decks to folders to organize their study materials. 
 - Apply tags to their decks to allow for better searchability. 
 - Search for decks by tag, title, and/or content
 - Search through folders manually
 - Test their knowledge using any deck created on the platform through a variety of different quiz types. 




**Project Members**:
- Collin Stebbins (Front-end)
- Anthony Crowe (Front-end)
- Johnathan Weller (Back-end)
- Kyle Chamblee (Back-end)



**Dependencies for Running the Server Locally
go-packages:
- cosmtrek/air - https://github.com/cosmtrek/air
- gorilla/mux - github.com/gorilla/mux
- rs/cors - github.com/rs/cors

Ensure that your path is correctly set. On Mac (if using zsh) Put this in your .zshrc file and restart the terminal. 
``` export PATH=$PATH:$(go env GOPATH)/bin ```


**Unit Tests**:
- Deck: Can load from deck data
- Deck: Can edit cards
- Deck: Can edit cards partially
- Deck: Can add tags
- Deck: Can remove tags
- Deck: Can add cards
- Deck: Can remove cards
- Deck: Can edit deck name
- Deck: Can change favorite status
- All the angular components: Did it get created

**Cypress Tests**:
- Made for an older version of the code, both front and back. No longer works.
- Need to make new tests for all the components.
- Each component should be able to be tested independently in the current state.
- Due to the code design, unit testing, either doesn't make sense or is impossible. (Most components just call functions in the services)


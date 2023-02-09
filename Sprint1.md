Link to front end video: https://youtu.be/OFxqSoddD3c
Link to back end video: 


User Stories:
As a [front-end] user, I want to be able to get a list of decks given a list of deck names so that I can iterate through the decks easily.
As a user, I want to be able to obtain a list of all deck names I have created so that navigating and editing decks is easier.
As a user, I want to be able to filter decks by owner so that other decks are easier to find and favorite, and to reduce overall bandwidth.
As a user, I want the ability to delete specific cards from my deck so that I can remove content that no longer applies to my deck.
As a user, I want to be able to delete an entire deck so that when I am done using it, I do not have to delete every card one by one.
As a user I want to be able to create a deck so that I have a container to store cards of similar content.
As a user, I want the ability to create a card for my deck so that I can use the information on the front and back sides as a study tool.
As a user, I want to be able to flag my card as a favorite in order to highlight important information or add my favorite cards to a deck.
As a user, I want to be able to favorite decks so that I can easily see decks I deem important or to merge them with other decks.
As a user, I want to be able to flag my decks as shareable so that other users can freely use what I have created.
As a user, I want the main menu to properly display the data in a user-friendly format, so that I can quickly navigate to the correct tab with minimum error.
As a user, I want the main menu to contain links to all other tabs, so that I have easy access to my desired location.
As a user, I want the deck that is currently selected in the Deck Selection tab to be selected any time a deck is needed so that I have easy access to the current deck and do not unintentionally edit a different deck.
As a user, I want the Deck Editor tab to allow me to change the name of the deck and the content of cards so that I can add or change information seamlessly.
As a user, I want any new content I’ve added to be saved automatically so that I cannot lose progress or information due to any unexpected errors.
As a user, I can go through a deck’s flashcards in a randomized order, so that I can quickly review information and self-assess, similar to traditional flash cards.
As a user, I do not want any repeat cards until every card has been shown, so that I can study and retain all information equally.
As a user, I want to be able to manually navigate to the next and previous cards, so that I can skip those that are not relevant at the time.
As a user, I want the multiple choice tab to provide questions created directly from my deck in a multiple choice format so that I can study the information effectively.
As a user, I want to choose what information (front/back/random side of cards) the questions will consist of, which would allow me to study information in a similar format to how I will be tested.
As a user, I want the incorrect answer choices to be directly from other cards in the deck, so that I have the extra challenge of differentiating similar information.
As a user, I want instant feedback after answering a question, so that I can keep track of what terms/concepts I may need to look into further.
As a user, I want to be tested more often on cards that I answer incorrectly on, so that I do not waste time answering questions on cards I have an adequate understanding of.
As a user, I should be able to skip questions that I either do not know or like, so that I only have to spend time answering questions that I feel are beneficial.

Issues:
The largest issue that we’ve faced so far is developing a structure that is compatible and convenient for both the front and backend. As we individually set up and began working on each, it has been a challenge to shift our direction on both sides and meet in the middle with a structure that allows us the flexibility to achieve most if not all of our goals.

For the frontend specifically, we wanted to have an autofill feature when searching for decknames. A functional Deck Editor Tab with the ability to not only change the information on the cards but also the order at which they sit in the deck. We planned to have a flashcard design that mimics that of traditional cards and that has some kind of interactivity with the mouse cursor whether being hovered or clicked on. We also planned to remove the Deck Selection Tab as a whole and have it be something that is editable from anywhere a deck is being shown.

Within the timeframe for Sprint 1 we were able to complete the autofill feature and create a base for the Deck Editor tab. Unfortunately due to the focus on compatibility between the frontend and backend we were unable to achieve some of the other goals. As we have some of the more glaring issues, we can expect to make significant progress in the near future.

[ADD BACKEND ISSUES & COMPLETED/NOT COMPLETED HERE]
During Sprint 1, the issues the backend team planned to address were:
The ability to create a deck and store in within the firestore database
The ability to create cards within decks and store them in their proper container within the database
The ability to retrieve a deck or list of decks from the database
The ability to retrieve the cards associated with a deck from the database
The ability to remove entire decks, with all associated cards, from the firestore database
The ability to remove specific cards from within decks
The ability to edit the content of a deck such as the ID, name, isFavorite, and isShareable flags and properly update the database
The ability to edit the content of cards, such as the front and back text
The ability to connect created decks, and cards by extension, to the user that created them
The ability to have user log-in and authentication
The ability to add a user to the database. 
The ability to get user information from the database. 
The ability to update a user’s information in the database. 
The ability to remove a user from the database. 


We were able to successfully complete:
The ability to create a deck and store in within the firestore database
The ability to create cards within decks and store them in their proper container within the database
The ability to retrieve a deck or list of decks from the database**
The ability to retrieve the cards associated with a deck from the database
The ability to remove entire decks, with all associated cards, from the firestore database
The ability to edit the deck information such as the name, isFavorite, and isShareable flags and properly update the database
The ability to add a user to the database. 
The ability to get user information from the database. 
The ability to update a user’s information in the database. 
The ability to remove a user from the database. 

The issues that we are still progressing through are:
The ability to have user log-in and authentication
We found that this functionality will take a bit more than anticipated with authenticating credentials
The ability to remove specific cards from within decks
Removing specific cards within decks requires obtaining the firestore document reference for each individual card. We have worked with implementation through using iterables and matching the document reference ID to the card ID passed, however we are still unable to isolate specific cards at this time.
The ability to edit the content of cards, such as the front and back text
Like removing the individual cards, this will take some more work to isolate the specific card to update and merge with the database.
Public and private decks/Making decks shareable among users. 
This is simply functionality we didn’t get to. 
Frontend and Backend integration. We didn’t have a clear outline of exactly how the front end expects data to be sent and received by the backend api. However, we have had many conversations that have led to more clarity and a game plan for the coming two weeks. 

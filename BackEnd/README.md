# Squizzy Backend Endpoints

## Backend Setup

### Config Setup

In the BackEnd>server folder create a new folder called ```config```

Within this folder create a new file called ```config.json```

This file should have the following structure:
```
{
    "firestore_cred_path": "/FULL/PATH/TO/CREDENTIAL/FILE.json",
    "project-id": "PROJECT-ID-HERE"
}
```

You must also place the database credential file in this ```config``` folder. 

### Dependencies for Running the Server Locally
go-packages:
- cosmtrek/air - https://github.com/cosmtrek/air
- gorilla/mux - github.com/gorilla/mux
- rs/cors - github.com/rs/cors

Ensure that your path is correctly set. On Mac (if using zsh) Put this in your .zshrc file and restart the terminal. 
``` export PATH=$PATH:$(go env GOPATH)/bin ```

You can search for similar instructions if on another OS.

You should be able to start the server by running ```air``` from the server directory. 


## Current API Endpoints

Deck Endpoints
```/createdeck``` - POST
```/getdeck/{id}``` - GET
```/updatedeck/{id}/{param}/{val}``` - PUT
```/removedeck/{id}``` - DELETE
```/removecard/{deckID}/cards/{cardID}``` DELETE

Search Endpoints
```/getdecklist/{name}``` - GET

User Endpoints
```/createuser``` - POST
```/getuser/{id}``` - GET
```/updateuser/{id}/{param}/{val}``` - PUT
```/removeuser/{id}``` - DELETE


## Deck Endpoints

### Create Deck:
```/createdeck```
Used to create/save a new deck to the database

Request must include the following json format in the request:
```
{
    "ID": "03",
    "Name": "My Deck",
    "Topic": "CS",
    "IsFavorite": true,
	"Cards": [
		{
			"ID": "card1",
			"FrontText": "front",
			"BackText": "back",
            "IsFavorite": false
		},
        {
			"ID": "card2",
			"FrontText": "front2",
			"BackText": "back2",
            "IsFavorite": true
		},
        {
			"ID": "card3",
			"FrontText": "front3",
			"BackText": "back3",
            "IsFavorite": false
		}
		
	]
} 
```
Currently, the response from a sucessful save, is this same data in this format. 

### Get Deck
```/getdeck/{id}```
Used to get a deck by its identifier. 
When using this endpoint, replace the ```{id}``` with the id of the deck. 

Successful Response:
```
{
    "Cards": [
        {
            "BackText": "back",
            "FrontText": "front",
            "ID": "card1",
            "IsFavorite": false
        },
        {
            "BackText": "back2",
            "FrontText": "front2",
            "ID": "card2",
            "IsFavorite": true
        },
        {
            "BackText": "back3",
            "FrontText": "front3",
            "ID": "card3",
            "IsFavorite": false
        }
    ],
    "ID": "03",
    "IsFavorite": true,
    "Name": "My Deck",
    "Tags": null
}
```

### Update a Deck Parameter
```/updatedeck/{id}/{param}/{val}```
Updates a specific deck's attributes

When using this endpoint, replace ```{id}/{param}/{val}``` with the deckID value, deck parameter name, and the value it should be changed to. 

Successful Response:
```
{
    "id": "03",
    "param": "IsFavorite",
    "val": "false"
}
```

### Remove a Deck Endpoint
```/removedeck/{id}```
Removes a specific deck by id

When using this endpoint, replace ```{id}``` with the deckID that should be removed. 

Successful Reponse: Status 202 Accepted.


### Remove a Card Endpoint
```/removecard/{deckID}/cards/{cardID}```
Removes a Card based on deckId and cardID. 

When using this endpoint, replace ```{deckID}``` and ```{cardID}``` with the deckID in which the card is located and the id of the card within the deck (cardID) respectively. 

Sample Response:
#TODO


## Search Endpoints

### Get List of Decks 
```/getdecklist/{name}```
Returns a list of deck IDs given a name to search on. 

When using this endpoint, replace ```{name}``` with a string that can be used to search the database for decks matching that name. 

Note: Search name must be encoded. For example for the name "My Deck" your search would look like ```/getdecklist/My%20Deck```

## TODO
User Endpoints
```/createuser```
```/getuser/{id}```
```/updateuser/{id}/{param}/{val}```
```/removeuser/{id}```


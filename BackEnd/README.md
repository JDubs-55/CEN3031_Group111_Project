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

CRUD Deck Endpoints
```/api/createdeck``` - GET
```/api/getdeck/{id}``` - GET
```/api/getalldecks``` - GET
```/api/updatedeck/{id}``` - PUT
```/api/removedeck/{id}``` - DELETE

More Specific Deck Endpoints
```/api/updatedeckinfo/{id}/{param}/{val}``` - PUT

Search Endpoints
```/api/getdecklist/{name}``` - GET

User Endpoints
```/api/createuser``` - POST
```/api/getuser/{id}``` - GET
```/api/updateuser/{id}/{param}/{val}``` - PUT
```/api/removeuser/{id}``` - DELETE


## CRUD Deck Endpoints

### Create Deck:
```/api/createdeck```
Used to create a new deck in the database

After endpoint is called, response includes the id of the newly created deck in this format. 

```
{
    "id": "MsGyevyTLNij1U7nwrjI"
}
```

### Get Deck
```/api/getdeck/{id}```
Used to get a deck by its identifier. 
When using this endpoint, replace the ```{id}``` with the id of the deck. 

Successful Response:
```
{
	"id": "02",
    "name": "My Deck",
    "tags": null,
    "isFavorite": true,
	"cards": [
		{
			"id": "card1",
			"frontText": "front",
			"backText": "back",
            "isFavorite": false
		},
        {
			"id": "card2",
			"frontText": "front2",
			"backText": "back2",
            "isFavorite": true
		},
        {
			"id": "card3",
			"frontText": "front3",
			"backText": "back3",
            "isFavorite": false
		}
		
	]
}
```

### Get All Decks
```/api/getalldecks``` - GET
Accepts no arguments

Will return a list of all deck names in the database. JSON Response will look like this:
```
[
    "My Deck 1",
    "My Deck",
    "Default Name"
]
```

### Update Deck
```/api/updatedeck/{id}``` - PUT

When using this endpoint, the id of the deck must be in the endpoint call (url) and the request body must be the deck object in JSON form so something like this:
```
{
	"id": "02",
    "name": "My Deck",
    "tags": ["cs", "other"],
    "isFavorite": true,
	"cards": [
		{
			"id": "card1",
			"frontText": "front",
			"backText": "back",
            "isFavorite": false
		},
        {
			"id": "card2",
			"frontText": "front2",
			"backText": "back2",
            "isFavorite": true
		},
        {
			"id": "card3",
			"frontText": "front3",
			"backText": "back3",
            "isFavorite": false
		}
		
	]
}
``` 

The JSON response for a successful call is simply the request body sent back. 

### Remove a Deck
```/api/removedeck/{id}``` -DELETE
Removes a specific deck by id

When using this endpoint, replace ```{id}``` with the deckID that should be removed. 

Successful Reponse: Status 202 Accepted.



## More Specific Deck Endpoints 

### Update a Deck Parameter
```/api/updatedeckinfo/{id}/{param}/{val}```
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
### Create Card //TODO

### Update Deck Tags
```/api/updatedecktags/{id}``` - PUT
Updates a specific deck's tag list

To use this enpoint pass the id in the endpoint url ```{id}``` and the list of tags (strings) in the request body in the following format:
```
{
    "tags":["cs", "fun"]
}
```

Currently, a successful response will just be the request body sent back. 

### Remove a Card Endpoint
```/api/removecard/{deckID}/cards/{cardID}```
Removes a Card based on deckId and cardID. 

When using this endpoint, replace ```{deckID}``` and ```{cardID}``` with the deckID in which the card is located and the id of the card within the deck (cardID) respectively. 

Sample Response:
#TODO


## Search Endpoints

### Get List of Decks 
```/api/getdecklist/{name}```
Returns a list of deck IDs given a name to search on. 

When using this endpoint, replace ```{name}``` with a string that can be used to search the database for decks matching that name. 

Note: Search name must be encoded. For example for the name "My Deck" your search would look like ```/api/getdecklist/My%20Deck```


### User Endpoints

### Read/Create User Collection
```/getuser/{id}```
(v1) If the user has already registered, this will return a user object contiaing the user's information(collection). The information consists of the email address the user registered with, the username (defaulted to the user's email), and the user ID (generated when the user registers). If the user has registered but a collection does not yet exist, one is created for them, accessible via their user id, and returned.

When using this endpoint, replace ```{id}``` with a string represent the user's unique ID.

Sample Response:
```
{
    "Email": "test@test.com",
    "ID": "iTyTCz0MfGUdyhKEA6V7N1PUSql2",
    "Username": "test@test.com"
}
```

### Update User Information
```/updateuser/{id}/{param}/{val}```
(v1) On success, returns the request. The retrun will contain the parameter that was updated, the user's id, and the value of the updated parameter.

When using this endpoint, replace ```{id}``` with the user's id, ```{param}``` with the parameter to edit, and ```{val}``` with the value to replace the parameter with. Currently the only editable value is the Username as the ID and Email should remain constant for now.

Successful Response:
```
{
    "param": "Username",
    "id": "iTyTCz0MfGUdyhKEA6V7N1PUSql2",
    "val": "test"
}
```

### Remove User and User Collection
```/removeuser/{id}```
(v1) On success, removes the User's collection within the database and deletes the user's account. 

Successful Response: Status 202 Accepted.


package model

import (
	"CEN3031_Group111_Project/BackEnd/server/utils"
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type Card struct {
	ID         string `json:"id"`
	FrontText  string `json:"frontText"`
	BackText   string `json:"backText"`
	IsFavorite bool   `json:"isFavorite"`
}

type Deck struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	Tags       []string `json:"tags"`
	IsFavorite bool     `json:"isFavorite"`
	Cards      []Card   `json:"cards"`
	Owner      string   `json:"owner"`
}

type User struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	ID       string `json:"id,omitempty"`
}

type DeckListItem struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

var client *firestore.Client
var app *firebase.App

func init() {

	ctx := context.Background()

	var creds = utils.ReadConfig()
	var err error

	sa := option.WithCredentialsFile(creds["firestore_cred_path"].(string))

	client, err = firestore.NewClient(ctx, creds["project-id"].(string), sa)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	config := &firebase.Config{ProjectID: creds["project-id"].(string)}
	app, err = firebase.NewApp(ctx, config, sa)
	if err != nil {
		log.Fatalf("Failed to initialize app: %v\n", err)
	}

}

// Basic Deck CRUD Operations

func CreateDeck() (string, error) {
	ctx := context.Background()
	var deck Deck
	ref := client.Collection("Decks").NewDoc()
	fmt.Print(ref.ID)
	deck.ID = ref.ID
	deck.Name = "Default Name"
	_, err := ref.Set(ctx, deck)

	if err != nil {
		log.Printf("An error has occured: %s", err)
		return "", err
	}

	return deck.ID, nil
}

func GetAllDecks() ([]string, error) {

	ctx := context.Background()

	iter := client.Collection("Decks").Where("Name", "!=", "").Documents(ctx)

	nameMap := make(map[string]string)
	var deckNames []string
	var err error

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			fmt.Println("Finished retrieving decks.")
			break
		}

		deck, err2 := GetDeckByID(doc.Ref.ID)
		if err2 != nil {
			fmt.Println("Error retrieving deck " + doc.Ref.ID)
		}

		var deckName string = deck.Name
		if deckName != "" {
			nameMap[deckName] = deckName
		}

	}

	for _, v := range nameMap {
		deckNames = append(deckNames, v)
	}

	return deckNames, err
}

func GetDeckByID(docID string) (*Deck, error) {

	ctx := context.Background()

	docSnap, err := client.Collection("Decks").Doc(docID).Get(ctx)
	if err != nil {
		fmt.Print("Error getting deck")
		return nil, err
	}

	data := &Deck{}
	err = docSnap.DataTo(data)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func UpdateDeck(deckID string, deck Deck) error {
	ctx := context.Background()
	_, err := client.Collection("Decks").Doc(deckID).Set(ctx, deck)

	if err != nil {
		fmt.Print(err)
		return err
	}

	return nil
}

func RemoveDeckByID(docID string) error {

	ctx := context.Background()
	_, err := client.Collection("Decks").Doc(docID).Delete(ctx)
	if err != nil {
		fmt.Println("Error removing deck.")
		return err
	}

	return nil
}

func GetDeckList(name string) ([]DeckListItem, error) {
	ctx := context.Background()
	var deckItems []DeckListItem

	iter := client.Collection("Decks").Where("Name", "==", name).Documents(ctx)

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		var data map[string]interface{}
		doc.DataTo(&data)

		var deckData = new(DeckListItem)
		deckData.ID = data["ID"].(string)
		deckData.Name = data["Name"].(string)

		deckItems = append(deckItems, *deckData)
	}

	return deckItems, nil
}

// More specific deck endpoints

func UpdateDeckInfo(docID string, param string, value string) error {

	ctx := context.Background()

	_, err := client.Collection("Decks").Doc(docID).Update(ctx, []firestore.Update{
		{
			Path:  param,
			Value: value,
		},
	})
	if err != nil {
		fmt.Print("Error updating deck information.")
		return err
	}

	return nil
}

// TODO: CHANGE NAME TO UpdateCards
// Will handle creating and updating info since this function will replace all cards each time
// Need to figure out how to add just 1 card... maybe?
func CreateCard(card []Card, deckID string) error {
	ctx := context.Background()

	_, err := client.Collection("Decks").Doc(deckID).Set(ctx, map[string]interface{}{
		"Cards": card,
	}, firestore.MergeAll)

	if err != nil {
		fmt.Print("Error updating deck information.")
		return err
	}

	return err
}

func UpdateDeckTags(deckID string, tags []string) error {
	ctx := context.Background()

	_, err := client.Collection("Decks").Doc(deckID).Set(ctx, map[string]interface{}{
		"Tags": tags,
	}, firestore.MergeAll)

	if err != nil {
		fmt.Print("Error updating deck tags.")
		return err
	}

	return err
}

/**************************************************************************/
// User Functions
func CreateUser(user User) error {
	ctx := context.Background()

	//ref := client.Collection("Users").NewDoc()
	//fmt.Print(ref.ID)
	//user.ID = ref.ID
	//_, err := ref.Set(ctx, user)

	// Users will be created on the FE
	// Once the user token is passed from the FE, verifyuser/tokenid  //TODO
	// once verified, get the userid from the token and send it to getUserByID
	//If user exists, infomation will be pulled from "Users" collection about that user
	//if not, getUserByID creates a new user with username = email, id = userID (from token), and and empty deck array
	//once getUserByID creates the new user, it sends that object here to have its 'document' created with refID = userID (from token)
	_, err := client.Collection("Users").Doc(user.ID).Set(ctx, user)

	if err != nil {
		log.Printf("An error has occured: %s", err)
		return err
	}

	return nil
}

func GetUserByID(userID string) (map[string]interface{}, error) {
	ctx := context.Background()

	//Get Auth client
	authClient, authErr := app.Auth(ctx)
	if authErr != nil {
		fmt.Printf("Error retrieving Auth client: %v\n", authErr)
	}

	token, err := authClient.VerifyIDToken(ctx, userID)
	if err != nil {
		fmt.Printf("Error verifying ID token: %v\n", err)
	}

	//fmt.Printf("Verified ID token: %v\nToken.UID = %v\n", token, token.UID)
	uid := token.UID

	//Will retrieve uid from the token passed from FE in the endpoint, hardcoded for now for testing
	//Gets user data from user ID -- error on invalid uid
	usr, err := authClient.GetUser(ctx, uid)
	if err != nil {
		fmt.Printf("Error retrieving User %s: %v\n", uid, err)
		return nil, err
	}

	//If user exists and auth passes, populate user data structure with "Users" collection,
	//retrieving user info by uid as below
	//fmt.Printf("Successfully returned user data: %v\n", &usr.UserInfo) //usr object has a lot of options
	fmt.Println("Successfully found user data.")

	userSnap, err := client.Collection("Users").Doc(uid).Get(ctx)
	if err != nil {
		fmt.Println("Error retrieving user information. User does not exist. Creating new user...")
		newUser := User{
			Email:    usr.Email,
			Username: usr.Email,
			ID:       usr.UID,
		}
		err = CreateUser(newUser)
		if err != nil {
			return nil, err
		}
		userSnap, err = client.Collection("Users").Doc(uid).Get(ctx)
		if err != nil {
			return nil, err
		}
	}

	var data map[string]interface{}
	err = userSnap.DataTo(&data)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func UpdateUserById(userID string, attr string, val string) error {
	ctx := context.Background()

	_, err := client.Collection("Users").Doc(userID).Update(ctx, []firestore.Update{
		{
			Path:  attr,
			Value: val,
		},
	})
	if err != nil {
		fmt.Println("Error updating user information.")
		return err
	}

	return nil
}

func RemoveUserById(userID string) error {
	ctx := context.Background()

	//Get Auth client
	authClient, authErr := app.Auth(ctx)
	if authErr != nil {
		fmt.Printf("Error retrieving Auth client: %v\n", authErr)
	}

	//Will retrieve uid from the token passed from FE in the endpoint, hardcoded for now for testing
	//Gets user data from user ID -- error on invalid uid
	_, err := authClient.GetUser(ctx, userID)
	if err != nil {
		fmt.Printf("Error locating User %s: %v\n", userID, err)
		return err
	}

	//Remove User object from Documents
	_, err = client.Collection("Users").Doc(userID).Delete(ctx)
	if err != nil {
		fmt.Println("Error removing user data.")
		return err
	}

	//Remove signed-up User from DB
	err = authClient.DeleteUser(ctx, userID)
	if err != nil {
		fmt.Println("Error deleting user.")
		return err
	}

	return nil
}

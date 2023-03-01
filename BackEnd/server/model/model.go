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
			nameMap[deck.ID] = deckName
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
	_, err := client.Collection("Decks-V2").Doc(docID).Delete(ctx)
	if err != nil {
		fmt.Println("Error removing deck.")
		return err
	}

	return nil
}

func GetDeckList(owner string) ([]DeckListItem, error) {
	ctx := context.Background()
	var deckItems []DeckListItem

	iter := client.Collection("Decks-V2").Where("Owner", "==", owner).Documents(ctx)

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			fmt.Println("Failed retrieving user decks.")
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

	// Users will be created on the FE
	// Once the user token is passed from the FE, it is sent to GetUserById()
	// Once verified, GetUserById() will retrieve the user ID from the token
	// If user exists, infomation will be pulled from "Users" collection about that user
	// If not, GetUserByID() creates a new user object with email/username = email and id = userID
	// 	GetUserByID will pass the new user object here where it will have its collection created in the DB
	// 	The collection ID = user ID
	_, err := client.Collection("Users").Doc(user.ID).Set(ctx, user)

	if err != nil {
		log.Printf("An error has occured: %s", err)
		return err
	}

	return nil
}

func GetUserByID(usrToken string) (map[string]interface{}, error) {
	ctx := context.Background()

	//Get Auth client
	authClient, authErr := app.Auth(ctx)
	if authErr != nil {
		fmt.Printf("Error retrieving Auth client: %v\n", authErr)
		return nil, authErr
	}

	//Get verified token
	token, err := authClient.VerifyIDToken(ctx, usrToken)
	if err != nil {
		fmt.Printf("Error verifying ID token: %v\n", err)
		return nil, err
	}

	//Get user ID from token
	uid := token.UID

	//Gets user data from user ID -- error on invalid uid
	//Ensures user has registered an account
	usr, err := authClient.GetUser(ctx, uid)
	if err != nil {
		fmt.Printf("Error retrieving User %s: %v\n", uid, err)
		return nil, err
	}

	//If user exists and auth passes, populate user data structure with "Users" collection,
	//retrieving user info by uid as below
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
		fmt.Printf("User %v created.\n", newUser.Email)
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

func UpdateUser(usrToken string, attr string, val string) error {
	ctx := context.Background()

	//Make sure the correct case wont be an issue
	//If not matching precisely, will create a new parameter
	if attr == "username" {
		attr = "Username"
	}
	/**** Possible Future functionality ****/
	// else if attr == "email" {
	// 	attr = "Email"
	// }
	/***************************************/
	//Ensures that only the username and email parameters can be modified
	if attr != "Username" { //&& attr != "Email" {
		err := fmt.Errorf("unable to modify parameter %v", attr)
		return err
	}

	//Get Auth client
	authClient, authErr := app.Auth(ctx)
	if authErr != nil {
		fmt.Printf("Error retrieving Auth client: %v\n", authErr)
		return authErr
	}

	//Get verified token
	token, err := authClient.VerifyIDToken(ctx, usrToken)
	if err != nil {
		fmt.Printf("Error verifying ID token: %v\n", err)
		return err
	}

	//Get user ID from verified token
	userID := token.UID

	//Update information in User's collection
	_, err = client.Collection("Users").Doc(userID).Update(ctx, []firestore.Update{
		{
			Path:  attr,
			Value: val,
		},
	})
	if err != nil {
		fmt.Println("Error updating user information.")
		return err
	}

	/****** Possible future functionality *******/
	//If the user changed their email, update their account information as well
	// if attr == "Email" {
	// 	_, err = authClient.UpdateUser(ctx, userID, (&auth.UserToUpdate{}).Email(val))
	// 	if err != nil {
	// 		fmt.Println("Error updating email for user account.")
	// 		return err
	// 	}
	// }
	/*******************************************/
	return nil
}

func RemoveUserById(usrToken string) error {
	ctx := context.Background()

	//Get Auth client
	authClient, authErr := app.Auth(ctx)
	if authErr != nil {
		fmt.Printf("Error retrieving Auth client: %v\n", authErr)
	}

	//Get verified token
	token, err := authClient.VerifyIDToken(ctx, usrToken)
	if err != nil {
		fmt.Printf("Error verifying ID token: %v\n", err)
		return err
	}

	//Get user ID from verified token
	userID := token.UID

	//Gets user data from user ID -- error on invalid uid
	userData, err := authClient.GetUser(ctx, userID)
	if err != nil {
		fmt.Printf("Error locating User %s: %v\n", userID, err)
		return err
	}

	//Remove all Decks owned by the user
	iter := client.Collection("Decks-V2").Where("Owner", "==", userData.Email).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			fmt.Println("Failed removing user decks.")
			return err
		}
		doc.Ref.Delete(ctx)
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

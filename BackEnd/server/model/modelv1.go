package model

import (
	"CEN3031_Group111_Project/BackEnd/server/utils"
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type CardV1 struct {
	ID         string `json:"id"`
	FrontText  string `json:"frontText"`
	BackText   string `json:"backText"`
	IsFavorite bool   `json:"isFavorite"`
}

type DeckV1 struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	Tags       []string `json:"tags"`
	IsFavorite bool     `json:"isFavorite"`
	Cards      []Card   `json:"cards"`
}

type UserV1 struct {
	Username string `json:"username"`
	ID       string `json:"id,omitempty"`
	Decks    []Deck `json:"decks"`
}

type DeckListItemV1 struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

var clientV1 *firestore.Client

func init() {

	var creds = utils.ReadConfig()

	ctx := context.Background()
	sa := option.WithCredentialsFile(creds["firestore_cred_path"].(string))
	var err error
	clientV1, err = firestore.NewClient(ctx, creds["project-id"].(string), sa)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

}

// Basic Deck CRUD Operations

func CreateDeckV1() (string, error) {
	ctx := context.Background()
	var deck DeckV1
	ref := clientV1.Collection("Decks").NewDoc()
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

func GetAllDecksV1() ([]string, error) {

	ctx := context.Background()

	iter := clientV1.Collection("Decks").Where("Name", "!=", "").Documents(ctx)

	nameMap := make(map[string]string)
	var deckNames []string
	var err error

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			fmt.Println("Finished retrieving decks.")
			break
		}

		deck, err2 := GetDeckByIDV1(doc.Ref.ID)
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

func GetDeckByIDV1(docID string) (*DeckV1, error) {

	ctx := context.Background()

	docSnap, err := clientV1.Collection("Decks").Doc(docID).Get(ctx)
	if err != nil {
		fmt.Print("Error getting deck")
		return nil, err
	}

	data := &DeckV1{}
	err = docSnap.DataTo(data)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func UpdateDeckV1(deckID string, deck DeckV1) error {
	ctx := context.Background()
	_, err := clientV1.Collection("Decks").Doc(deckID).Set(ctx, deck)

	if err != nil {
		fmt.Print(err)
		return err
	}

	return nil
}

func RemoveDeckByIDV1(docID string) error {

	ctx := context.Background()
	_, err := clientV1.Collection("Decks").Doc(docID).Delete(ctx)
	if err != nil {
		fmt.Println("Error removing deck.")
		return err
	}

	return nil
}

func GetDeckListV1(name string) ([]DeckListItemV1, error) {
	ctx := context.Background()
	var deckItems []DeckListItemV1

	iter := clientV1.Collection("Decks").Where("Name", "==", name).Documents(ctx)

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

		var deckData = new(DeckListItemV1)
		deckData.ID = data["ID"].(string)
		deckData.Name = data["Name"].(string)

		deckItems = append(deckItems, *deckData)
	}

	return deckItems, nil
}

// More specific deck endpoints

func UpdateDeckInfoV1(docID string, param string, value string) error {

	ctx := context.Background()

	_, err := clientV1.Collection("Decks").Doc(docID).Update(ctx, []firestore.Update{
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
func CreateCardV1(card []CardV1, deckID string) error {
	ctx := context.Background()

	_, err := clientV1.Collection("Decks").Doc(deckID).Set(ctx, map[string]interface{}{
		"Cards": card,
	}, firestore.MergeAll)

	if err != nil {
		fmt.Print("Error updating deck information.")
		return err
	}

	return err
}

func UpdateDeckTagsV1(deckID string, tags []string) error {
	ctx := context.Background()

	_, err := clientV1.Collection("Decks").Doc(deckID).Set(ctx, map[string]interface{}{
		"Tags": tags,
	}, firestore.MergeAll)

	if err != nil {
		fmt.Print("Error updating deck tags.")
		return err
	}

	return err
}

func RemoveCardByIDV1(deckID string, cardID string) error {

	ctx := context.Background()
	iter := clientV1.Collection("Decks").Doc(deckID).Collection("Cards").Documents(ctx)

	batch := clientV1.Batch()
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			fmt.Println("Card not found.")
			break
		}
		if err != nil {
			fmt.Println("Error removing card.")
			return err
		}
		if doc.Ref.ID == cardID {
			fmt.Println("yay")
		}
	}

	batch.Commit(ctx)

	return nil
}

// User Functions
func CreateUserV1(user UserV1) error {
	ctx := context.Background()

	ref := clientV1.Collection("Users").NewDoc()
	fmt.Print(ref.ID)
	user.ID = ref.ID
	_, err := ref.Set(ctx, user)

	if err != nil {
		log.Printf("An error has occured: %s", err)
		return err
	}

	return nil
}

func GetUserByIDV1(userID string) (map[string]interface{}, error) {
	ctx := context.Background()

	userSnap, err := clientV1.Collection("Users").Doc(userID).Get(ctx)
	if err != nil {
		return nil, err
	} else {
		fmt.Print("Error getting deck")
	}

	var data map[string]interface{}
	err = userSnap.DataTo(&data)

	if err != nil {
		return nil, err
	}
	return data, nil
}

func UpdateUserByIdV1(userID string, attr string, val string) error {
	ctx := context.Background()

	_, err := clientV1.Collection("Users").Doc(userID).Update(ctx, []firestore.Update{
		{
			Path:  attr,
			Value: val,
		},
	})
	if err != nil {
		fmt.Print("Error updating user information.")
		return err
	}

	return nil
}

func RemoveUserByIdV1(userID string) error {
	ctx := context.Background()
	_, err := clientV1.Collection("Users").Doc(userID).Delete(ctx)
	if err != nil {
		fmt.Println("Error removing user.")
		return err
	}

	return nil
}

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
}

type User struct {
	Username string `json:"username"`
	ID       string `json:"id,omitempty"`
	Decks    []Deck `json:"decks"`
}

type DeckListItem struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

var client *firestore.Client

func init() {

	var creds = utils.ReadConfig()

	ctx := context.Background()
	sa := option.WithCredentialsFile(creds["firestore_cred_path"].(string))
	var err error
	client, err = firestore.NewClient(ctx, creds["project-id"].(string), sa)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
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

func RemoveCardByID(deckID string, cardID string) error {

	ctx := context.Background()
	iter := client.Collection("Decks").Doc(deckID).Collection("Cards").Documents(ctx)

	batch := client.Batch()
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
func CreateUser(user User) error {
	ctx := context.Background()

	ref := client.Collection("Users").NewDoc()
	fmt.Print(ref.ID)
	user.ID = ref.ID
	_, err := ref.Set(ctx, user)

	if err != nil {
		log.Printf("An error has occured: %s", err)
		return err
	}

	return nil
}

func GetUserByID(userID string) (map[string]interface{}, error) {
	ctx := context.Background()

	userSnap, err := client.Collection("Users").Doc(userID).Get(ctx)
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

func UpdateUserById(userID string, attr string, val string) error {
	ctx := context.Background()

	_, err := client.Collection("Users").Doc(userID).Update(ctx, []firestore.Update{
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

func RemoveUserById(userID string) error {
	ctx := context.Background()
	_, err := client.Collection("Users").Doc(userID).Delete(ctx)
	if err != nil {
		fmt.Println("Error removing user.")
		return err
	}

	return nil
}

//Template Code

// func AddDocument(ctx context.Context, collection string, doc map[string]interface{}) error {
// 	_, _, err := client.Collection(collection).Add(ctx, doc)
// 	return err
// }

// func GetDocument(ctx context.Context, collection, docID string) (map[string]interface{}, error) {
// 	docSnap, err := client.Collection(collection).Doc(docID).Get(ctx)
// 	if err != nil {
// 		return nil, err
// 	}
// 	var data map[string]interface{}
// 	err = docSnap.DataTo(&data)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return data, nil
// }

// func UpdateDocument(ctx context.Context, collection, docID string, update map[string]interface{}) error {
// 	_, err := client.Collection(collection).Doc(docID).Set(ctx, update, firestore.MergeAll)
// 	return err
// }

// func DeleteDocument(ctx context.Context, collection, docID string) error {
// 	_, err := client.Collection(collection).Doc(docID).Delete(ctx)
// 	return err
// }

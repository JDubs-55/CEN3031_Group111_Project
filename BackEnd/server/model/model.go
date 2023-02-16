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
	ID         string
	FrontText  string
	BackText   string
	IsFavorite bool
}

type Deck struct {
	ID         string
	Name       string
	Tags       []string
	IsFavorite bool
	Cards      []Card
}

type User struct {
	Username string
	ID       string `json:"id,omitempty"`
	Decks    []Deck
}

type DeckListItem struct {
	ID   string
	Name string
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

func CreateDeck(deck Deck, deckID string) error {
	ctx := context.Background()
	_, err := client.Collection("Decks").Doc(deckID).Set(ctx, deck)
	return err
}

func GetDeckByID(docID string) (map[string]interface{}, error) {

	ctx := context.Background()

	docSnap, err := client.Collection("Decks").Doc(docID).Get(ctx)
	if err != nil {
		return nil, err
	} else {
		fmt.Print("Error getting deck")
	}

	var data map[string]interface{}
	err = docSnap.DataTo(&data)

	if err != nil {
		return nil, err
	}
	return data, nil
}

func GetAllDecks() ([]map[string]interface{}, error) {

	ctx := context.Background()

	iter := client.Collection("Decks").Documents(ctx)

	var decks []map[string]interface{}
	var err error

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			fmt.Println("Finished retrieving decks.")
			break
		}

		deck, err := GetDeckByID(doc.Ref.ID)
		if err != nil {
			fmt.Println("Error retrieving deck " + doc.Ref.ID)
		}

		decks = append(decks, deck)

		fmt.Printf("Added deck %s.\n", doc.Ref.ID)

	}

	return decks, err
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

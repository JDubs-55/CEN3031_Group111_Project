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
	Deck     []Deck
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

//addCard (to Deck)
//updateCard (in Deck)
//removeCard (from Deck)
//getCard (from Deck) - may not be necessary

//AddDeck
//UpdateDeck
//RemoveDeck
//GetDeck

//UpdateDeckInfo (Topic, Favorite, etc)
//UpdateCardInfo (Favorite)

//Future
//Make Deck Private/public

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

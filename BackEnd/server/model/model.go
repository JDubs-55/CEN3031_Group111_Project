package model

import (
	"CEN3031_Group111_Project/BackEnd/server/utils"
	"context"
	"log"

	"cloud.google.com/go/firestore"
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
	Topic      string
	IsFavorite bool
	Cards      []Card
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

func AddDocument(ctx context.Context, collection string, doc map[string]interface{}) error {
	_, _, err := client.Collection(collection).Add(ctx, doc)
	return err
}

func GetDocument(ctx context.Context, collection, docID string) (map[string]interface{}, error) {
	docSnap, err := client.Collection(collection).Doc(docID).Get(ctx)
	if err != nil {
		return nil, err
	}
	var data map[string]interface{}
	err = docSnap.DataTo(&data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func UpdateDocument(ctx context.Context, collection, docID string, update map[string]interface{}) error {
	_, err := client.Collection(collection).Doc(docID).Set(ctx, update, firestore.MergeAll)
	return err
}

func DeleteDocument(ctx context.Context, collection, docID string) error {
	_, err := client.Collection(collection).Doc(docID).Delete(ctx)
	return err
}

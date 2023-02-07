package main

import (
	"CEN3031_Group111_Project/BackEnd/server/model"
	"CEN3031_Group111_Project/BackEnd/server/router"

	"context"
	"fmt"
)

func main() {

	ctx := context.Background()

	// Add a document
	err := model.AddDocument(ctx, "collection", map[string]interface{}{
		"name": "John Doe",
		"age":  35,
	})
	if err != nil {
		fmt.Println(err)
	}

	router.SetupRouter()

}

package controller

import (
	"CEN3031_Group111_Project/BackEnd/server/model"
	"CEN3031_Group111_Project/BackEnd/server/utils"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// Testing function.
func HelloWorld(w http.ResponseWriter, r *http.Request) {
	var data = struct {
		Title string `json:"title"`
	}{
		Title: "Golang + Angular Starter Kit",
	}

	jsonBytes, err := utils.StructToJSON(data)
	if err != nil {
		fmt.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
	return
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

func CreateDeckHandler(w http.ResponseWriter, r *http.Request) {

	// Get the request body
	var deck model.Deck

	err := json.NewDecoder(r.Body).Decode(&deck)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// Save the user to the database
	err = model.CreateDeck(deck, deck.ID)
	if err != nil {
		http.Error(w, "Failed to save user", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(deck)
}

func GetDeckByIdHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	fmt.Print(deckID)

	// Save the user to the database
	deck, err := model.GetDeckByID(deckID)
	if err != nil {
		http.Error(w, "Failed to get deck.", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(deck)
}

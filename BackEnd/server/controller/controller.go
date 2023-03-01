package controller

import (
	"CEN3031_Group111_Project/BackEnd/server/model"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func CreateDeckHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	token := vars["token"]

	// Create a new deck on db and get the deck
	deck, err := model.CreateDeck(token)
	if err != nil {
		http.Error(w, "Failed to create deck", http.StatusInternalServerError)
		return
	}

	fmt.Printf("Successfully created deck %v with id %v.\n", deck.Name, deck.ID)

	// Format response with newly created deck's id.
	response := map[string]interface{}{
		"id": deck.ID,
	}

	// Return the new deck's id.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func GetAllDecksHandler(w http.ResponseWriter, r *http.Request) {
	deckNames, err := model.GetAllDecks()
	if err != nil {
		http.Error(w, "Failed to retrieve decks.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deckNames)
}

func GetDeckByIdHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	// Save the deck to the database
	deck, err := model.GetDeckByID(deckID)
	if err != nil {
		http.Error(w, "Failed to get deck.", http.StatusNotFound)
		return
	}

	// Return the saved deck
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deck)
}

func UpdateDeckHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	var deck model.Deck
	err := json.NewDecoder(r.Body).Decode(&deck)

	if deckID != deck.ID {
		http.Error(w, "Mismatching Deck IDs", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = model.UpdateDeck(deckID, deck)
	if err != nil {
		http.Error(w, "Failed to update deck", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(deck)

}

func RemoveDeckByIdHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	err := model.RemoveDeckByID(deckID)
	if err != nil {
		http.Error(w, "Failed to remove deck.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
}

func GetDeckListHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	deckList, err := model.GetDeckList(vars["owner"])

	if err != nil {
		http.Error(w, "Failed to get deck list", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deckList)
}

// Specific Deck Modification Endpoints
func UpdateDeckInfoHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]
	param := vars["param"]
	value := vars["val"]

	err := model.UpdateDeckInfo(deckID, param, value)
	if err != nil {
		http.Error(w, "Failed to update deck.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(vars)
}

func CreateCardHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["deckID"]

	var cards []model.Card

	err := json.NewDecoder(r.Body).Decode(&cards)
	if err != nil {
		http.Error(w, "Failed to parse request body.", http.StatusBadRequest)
		return
	}

	err = model.CreateCard(cards, deckID)
	if err != nil {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(cards)
}

func UpdateDeckTagsHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	type reqStructure struct {
		Tags []string `json:"tags"`
	}
	var data reqStructure

	err := json.NewDecoder(r.Body).Decode(&data)

	if err != nil {
		http.Error(w, "Failed to parse updateTag endpoint body.", http.StatusInternalServerError)
	}

	err = model.UpdateDeckTags(deckID, data.Tags)
	if err != nil {
		http.Error(w, "Failed to update deck tags.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(data)
}

/**************************************************************************/
// User endpoints

/***********************************************************************************/
//NO LONGER NEEDED, USERS ARE CREATED ON THE FE AND THE USER COLLECTION IS ADDED IN
//GetUserById()

// func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
// 	var user model.User

// 	err := json.NewDecoder(r.Body).Decode(&user)

// 	if err != nil {
// 		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
// 		return
// 	}

// 	err = model.CreateUser(user)
// 	if err != nil {
// 		http.Error(w, "Failed to create user", http.StatusInternalServerError)
// 		return
// 	}

// 	// Return the saved user
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(user)
// }
/***********************************************************************************/

func GetUserByIdHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	token := vars["token"]

	user, err := model.GetUserByID(token)
	if err != nil {
		http.Error(w, "Failed to get user.", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	token := vars["token"]
	value := vars["val"]
	param := vars["param"]

	err := model.UpdateUser(token, param, value)
	if err != nil {
		http.Error(w, "Failed to update user.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(vars)
}

func RemoveUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	token := vars["token"]

	err := model.RemoveUserById(token)
	if err != nil {
		http.Error(w, "Failed to remove user.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
}

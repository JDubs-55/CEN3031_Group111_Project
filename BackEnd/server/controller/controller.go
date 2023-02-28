package controller

import (
	"CEN3031_Group111_Project/BackEnd/server/model"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func CreateDeckHandler(w http.ResponseWriter, r *http.Request) {

	// Create a new deck on db and get the deck ID
	deckID, err := model.CreateDeck()
	if err != nil {
		http.Error(w, "Failed to create deck", http.StatusInternalServerError)
		return
	}

	fmt.Print(deckID)

	// Format response with newly created deck id.
	response := map[string]interface{}{
		"id": deckID,
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
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(deckNames)
}

func GetDeckByIdHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	// Save the deck to the database
	deck, err := model.GetDeckByID(deckID)
	if err != nil {
		http.Error(w, "Failed to get deck.", http.StatusInternalServerError)
		return
	}

	// Return the saved deck
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
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

	deckList, err := model.GetDeckList(vars["name"])

	if err != nil {
		http.Error(w, "Failed to get deck list", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
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
func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user model.User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = model.CreateUser(user)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func GetUserByIdHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	// Save the user to the database
	user, err := model.GetUserByID(userID)
	if err != nil {
		http.Error(w, "Failed to get user.", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]
	param := vars["param"]
	value := vars["val"]

	err := model.UpdateUserById(userID, param, value)
	if err != nil {
		http.Error(w, "Failed to update user.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(vars)
}

func RemoveUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	err := model.RemoveUserById(userID)
	if err != nil {
		http.Error(w, "Failed to remove user.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
}

package controller

import (
	"CEN3031_Group111_Project/BackEnd/server/model"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func CreateDeckHandlerV1(w http.ResponseWriter, r *http.Request) {

	// Create a new deck on db and get the deck ID
	deckID, err := model.CreateDeckV1()
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

func GetAllDecksHandlerV1(w http.ResponseWriter, r *http.Request) {
	deckNames, err := model.GetAllDecksV1()
	if err != nil {
		http.Error(w, "Failed to retrieve decks.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deckNames)
}

func GetDeckByIdHandlerV1(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	// Save the deck to the database
	deck, err := model.GetDeckByIDV1(deckID)
	if err != nil {
		http.Error(w, "Failed to get deck.", http.StatusNotFound)
		return
	}

	// Return the saved deck
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deck)
}

func UpdateDeckHandlerV1(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	var deck model.DeckV1
	err := json.NewDecoder(r.Body).Decode(&deck)

	if deckID != deck.ID {
		http.Error(w, "Mismatching Deck IDs", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = model.UpdateDeckV1(deckID, deck)
	if err != nil {
		http.Error(w, "Failed to update deck", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(deck)

}

func RemoveDeckByIdHandlerV1(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]

	err := model.RemoveDeckByIDV1(deckID)
	if err != nil {
		http.Error(w, "Failed to remove deck.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
}

func GetDeckListHandlerV1(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	deckList, err := model.GetDeckListV1(vars["name"])

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
func UpdateDeckInfoHandlerV1(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["id"]
	param := vars["param"]
	value := vars["val"]

	err := model.UpdateDeckInfoV1(deckID, param, value)
	if err != nil {
		http.Error(w, "Failed to update deck.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(vars)
}

func CreateCardHandlerV1(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["deckID"]

	var cards []model.CardV1

	err := json.NewDecoder(r.Body).Decode(&cards)
	if err != nil {
		http.Error(w, "Failed to parse request body.", http.StatusBadRequest)
		return
	}

	err = model.CreateCardV1(cards, deckID)
	if err != nil {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(cards)
}

func UpdateDeckTagsHandlerV1(w http.ResponseWriter, r *http.Request) {

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

	err = model.UpdateDeckTagsV1(deckID, data.Tags)
	if err != nil {
		http.Error(w, "Failed to update deck tags.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(data)
}

func RemoveCardByIdHandlerV1(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["deckID"]
	cardID := vars["cardID"]

	err := model.RemoveCardByIDV1(deckID, cardID)
	if err != nil {
		http.Error(w, "Failed to remove card.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
}

// User endpoints
func CreateUserHandlerV1(w http.ResponseWriter, r *http.Request) {
	var user model.UserV1

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = model.CreateUserV1(user)
	if err != nil {
		http.Error(w, "Failed to save deck", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func GetUserByIdHandlerV1(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	// Save the user to the database
	user, err := model.GetUserByIDV1(userID)
	if err != nil {
		http.Error(w, "Failed to get user.", http.StatusInternalServerError)
		return
	}

	// Return the saved user
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UpdateUserHandlerV1(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]
	param := vars["param"]
	value := vars["val"]

	err := model.UpdateUserByIdV1(userID, param, value)
	if err != nil {
		http.Error(w, "Failed to update user.", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(vars)
}

func RemoveUserHandlerV1(w http.ResponseWriter, r *http.Request) {
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

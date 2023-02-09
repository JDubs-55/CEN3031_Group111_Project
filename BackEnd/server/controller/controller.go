package controller

import (
	"CEN3031_Group111_Project/BackEnd/server/model"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user model.User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = model.CreateUser(user)
	if err != nil {
		http.Error(w, "Failed to save deck", http.StatusInternalServerError)
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

func CreateDeckHandler(w http.ResponseWriter, r *http.Request) {

	// Get the request body
	var deck model.Deck

	err := json.NewDecoder(r.Body).Decode(&deck)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// Save the deck to the database
	err = model.CreateDeck(deck, deck.ID)
	if err != nil {
		http.Error(w, "Failed to save deck", http.StatusInternalServerError)
		return
	}

	// Return the saved deck
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(deck)
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

func RemoveCardByIdHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	deckID := vars["deckID"]
	cardID := vars["cardID"]

	err := model.RemoveCardByID(deckID, cardID)
	if err != nil {
		http.Error(w, "Failed to remove card.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
}

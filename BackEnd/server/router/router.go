package router

import (
	"CEN3031_Group111_Project/BackEnd/server/controller"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	router := mux.NewRouter()

	// Register the GetUserHandler function as the handler for a specific URL
	router.HandleFunc("/api/createdeck", controller.CreateDeckHandler).Methods("GET")
	router.HandleFunc("/api/getalldecks", controller.GetAllDecksHandler).Methods("GET")
	router.HandleFunc("/api/getdeck/{id}", controller.GetDeckByIdHandler).Methods("GET")
	router.HandleFunc("/api/updatedeck/{id}", controller.UpdateDeckHandler).Methods("PUT")
	router.HandleFunc("/api/removedeck/{id}", controller.RemoveDeckByIdHandler).Methods("DELETE")
	//Get Deck List
	router.HandleFunc("/api/getdecklist/{name}", controller.GetDeckListHandler).Methods("GET")

	//More specific deck endpoints.
	router.HandleFunc("/api/updatedeckinfo/{id}/{param}/{val}", controller.UpdateDeckInfoHandler).Methods("PUT")
	router.HandleFunc("/api/createcard/{deckID}", controller.CreateCardHandler).Methods("POST")
	router.HandleFunc("/api/updatedecktags/{id}", controller.UpdateDeckTagsHandler).Methods("PUT")
	router.HandleFunc("/api/removecard/{deckID}/cards/{cardID}", controller.RemoveCardByIdHandler).Methods("DELETE")

	//User Endpoints
	router.HandleFunc("/api/createuser", controller.CreateUserHandler).Methods("POST")
	router.HandleFunc("/api/getuser/{id}", controller.GetUserByIdHandler).Methods("GET")
	router.HandleFunc("/api/updateuser/{id}/{param}/{val}", controller.UpdateUserHandler).Methods("PUT")
	router.HandleFunc("/api/removeuser/{id}", controller.RemoveUserHandler).Methods("DELETE")

	return router
}

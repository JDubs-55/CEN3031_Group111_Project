package router

import (
	"CEN3031_Group111_Project/BackEnd/server/controller"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	router := mux.NewRouter()

	// Register the GetUserHandler function as the handler for a specific URL
	router.HandleFunc("/api/createdeck", controller.CreateDeckHandlerV1).Methods("GET")
	router.HandleFunc("/api/getalldecks", controller.GetAllDecksHandlerV1).Methods("GET")
	router.HandleFunc("/api/getdeck/{id}", controller.GetDeckByIdHandlerV1).Methods("GET")
	router.HandleFunc("/api/updatedeck/{id}", controller.UpdateDeckHandlerV1).Methods("PUT")
	router.HandleFunc("/api/removedeck/{id}", controller.RemoveDeckByIdHandlerV1).Methods("DELETE")
	//Get Deck List
	router.HandleFunc("/api/getdecklist/{name}", controller.GetDeckListHandler).Methods("GET")

	//More specific deck endpoints.
	router.HandleFunc("/api/updatedeckinfo/{id}/{param}/{val}", controller.UpdateDeckInfoHandlerV1).Methods("PUT")
	router.HandleFunc("/api/createcard/{deckID}", controller.CreateCardHandlerV1).Methods("POST")
	router.HandleFunc("/api/updatedecktags/{id}", controller.UpdateDeckTagsHandlerV1).Methods("PUT")

	//User Endpoints
	router.HandleFunc("/api/createuser", controller.CreateUserHandlerV1).Methods("POST")
	router.HandleFunc("/api/getuser/{id}", controller.GetUserByIdHandlerV1).Methods("GET")
	router.HandleFunc("/api/updateuser/{id}/{param}/{val}", controller.UpdateUserHandlerV1).Methods("PUT")
	router.HandleFunc("/api/removeuser/{id}", controller.RemoveUserHandlerV1).Methods("DELETE")

	/** VERSION 2 ENDPOINT **/
	// Register the GetUserHandler function as the handler for a specific URL
	router.HandleFunc("/api/v2/createdeck", controller.CreateDeckHandler).Methods("GET")
	router.HandleFunc("/api/v2/getalldecks", controller.GetAllDecksHandler).Methods("GET")
	router.HandleFunc("/api/v2/getdeck/{id}", controller.GetDeckByIdHandler).Methods("GET")
	router.HandleFunc("/api/v2/updatedeck/{id}", controller.UpdateDeckHandler).Methods("PUT")
	router.HandleFunc("/api/v2/removedeck/{id}", controller.RemoveDeckByIdHandler).Methods("DELETE")

	//Get Deck List
	router.HandleFunc("/api/v2/getdecklist/{name}", controller.GetDeckListHandler).Methods("GET")

	//More specific deck endpoints.
	router.HandleFunc("/api/v2/updatedeckinfo/{id}/{param}/{val}", controller.UpdateDeckInfoHandler).Methods("PUT")
	router.HandleFunc("/api/v2/createcard/{deckID}", controller.CreateCardHandler).Methods("POST")
	router.HandleFunc("/api/v2/updatedecktags/{id}", controller.UpdateDeckTagsHandler).Methods("PUT")

	//User Endpoints
	// router.HandleFunc("/api/v2/createuser", controller.CreateUserHandler).Methods("POST") // No longer needed
	router.HandleFunc("/api/v2/getuser/{token}", controller.GetUserByIdHandler).Methods("GET")
	router.HandleFunc("/api/v2/updateuser/{token}/{param}/{val}", controller.UpdateUserHandler).Methods("PUT")
	router.HandleFunc("/api/v2/removeuser/{token}", controller.RemoveUserHandler).Methods("DELETE")

	return router
}

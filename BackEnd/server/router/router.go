package router

import (
	"CEN3031_Group111_Project/BackEnd/server/controller"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func SetupRouter() {
	router := mux.NewRouter()

	// Register the GetUserHandler function as the handler for a specific URL
	router.HandleFunc("/api/createdeck", controller.CreateDeckHandler).Methods("POST")
	router.HandleFunc("/api/createcard/{deckID}", controller.CreateCardHandler).Methods("POST")
	router.HandleFunc("/api/getdeck/{id}", controller.GetDeckByIdHandler).Methods("GET")
	router.HandleFunc("/api/getalldecks", controller.GetAllDecksHandler).Methods("GET")
	router.HandleFunc("/api/updatedeck/{id}/{param}/{val}", controller.UpdateDeckInfoHandler).Methods("PUT")
	router.HandleFunc("/api/removedeck/{id}", controller.RemoveDeckByIdHandler).Methods("DELETE")
	router.HandleFunc("/api/removecard/{deckID}/cards/{cardID}", controller.RemoveCardByIdHandler).Methods("DELETE")

	//User Endpoints
	router.HandleFunc("/api/createuser", controller.CreateUserHandler).Methods("POST")
	router.HandleFunc("/api/getuser/{id}", controller.GetUserByIdHandler).Methods("GET")
	router.HandleFunc("/api/updateuser/{id}/{param}/{val}", controller.UpdateUserHandler).Methods("PUT")
	router.HandleFunc("/api/removeuser/{id}", controller.RemoveUserHandler).Methods("DELETE")

	//Get Deck List
	router.HandleFunc("/api/getdecklist/{name}", controller.GetDeckListHandler).Methods("GET")

	// Use CORS middleware to handle cross-origin requests
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	})

	handler := c.Handler(router)
	http.ListenAndServe(":4201", handler)
}

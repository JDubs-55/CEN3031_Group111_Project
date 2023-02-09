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
	router.HandleFunc("/createdeck", controller.CreateDeckHandler).Methods("POST")
	router.HandleFunc("/getdeck/{id}", controller.GetDeckByIdHandler).Methods("GET")
	router.HandleFunc("/updatedeckinfo/{id}/{param}/{val}", controller.UpdateDeckInfoHandler).Methods("PUT")
	router.HandleFunc("/removedeck/{id}", controller.RemoveDeckByIdHandler).Methods("DELETE")

	//User Endpoints
	router.HandleFunc("/createuser", controller.CreateUserHandler).Methods("POST")
	router.HandleFunc("/getuser/{id}", controller.GetUserByIdHandler).Methods("GET")
	router.HandleFunc("/updateuser/{id}/{param}/{val}", controller.UpdateUserHandler).Methods("PUT")
	router.HandleFunc("/removeuser/{id}", controller.RemoveUserHandler).Methods("DELETE")

	// Use CORS middleware to handle cross-origin requests
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	})

	handler := c.Handler(router)
	http.ListenAndServe(":4201", handler)
}

//endpoints
// /createdeck
// /

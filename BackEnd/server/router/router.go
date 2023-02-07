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
	router.HandleFunc("/helloworld", controller.HelloWorld).Methods("GET")

	// Use CORS middleware to handle cross-origin requests
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	})

	handler := c.Handler(router)
	http.ListenAndServe(":4201", handler)
}

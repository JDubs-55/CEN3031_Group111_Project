package main

import (
	"CEN3031_Group111_Project/BackEnd/server/router"
	"net/http"

	"github.com/rs/cors"
)

func main() {

	r := router.SetupRouter()

	// Use CORS middleware to handle cross-origin requests
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	})
	handler := c.Handler(r)
	http.ListenAndServe(":4201", handler)
}

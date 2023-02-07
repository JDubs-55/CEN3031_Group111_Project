package controller

import (
	"CEN3031_Group111_Project/BackEnd/server/utils"
	"fmt"
	"net/http"
)

// Testing function.
func HelloWorld(w http.ResponseWriter, r *http.Request) {
	var data = struct {
		Title string `json:"title"`
	}{
		Title: "Golang + Angular Starter Kit",
	}

	jsonBytes, err := utils.StructToJSON(data)
	if err != nil {
		fmt.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
	return
}

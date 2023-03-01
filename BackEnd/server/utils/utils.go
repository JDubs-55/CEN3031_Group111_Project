package utils

import (
	"encoding/json"
	"io/ioutil"
	"log"
)

func ReadConfig() map[string]interface{} {

	// First read the `config.json` file

	content, err := ioutil.ReadFile("../config/config.json")
	if err != nil {
		log.Fatal("Error when opening config file: ", err)
	}

	// Unmarshall the data into `payload`
	var payload map[string]interface{}
	err = json.Unmarshal(content, &payload)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}

	return payload
}

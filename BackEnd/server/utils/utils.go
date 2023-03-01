package utils

import (
	_ "embed"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func getConfigFilePath() (string, error) {

	exName := filepath.Base(os.Args[0])

	var configPath string
	if strings.Contains(exName, "main") {
		configPath = "./config/config.json"
	} else if strings.Contains(exName, "test") {
		configPath = "../config/config.json"
	} else {
		return "", errors.New("Can't Read Config File")
	}

	return configPath, nil
}

func ReadConfig() map[string]interface{} {

	//Get config path
	configFilePath, err := getConfigFilePath()
	if err != nil {
		log.Fatal(err)
	}

	content, err := ioutil.ReadFile(configFilePath)
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

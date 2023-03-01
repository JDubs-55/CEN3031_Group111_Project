package tests

import (
	"CEN3031_Group111_Project/BackEnd/server/router"
	"bytes"
	"fmt"

	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// func TestAPI(t *testing.T) {
// 	r := router.SetupRouter()

// }

func TestDeckCRUDEndpoint(t *testing.T) {

	r := router.SetupRouter()

	//********** TEST CREATE DECK ENDPOINT **********
	req, err := http.NewRequest(http.MethodGet, "/api/createdeck", nil)
	var deckID string

	if err != nil {
		t.Fatal(err)
	}

	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	// Set deckID to be used in later functions.
	var jsonMap map[string]interface{}
	json.Unmarshal([]byte(rec.Body.String()), &jsonMap)
	deckID = jsonMap["id"].(string)

	//Check that the response Codes are correct.
	if rec.Code != http.StatusCreated {
		t.Errorf("expected status code %d but got %d", http.StatusCreated, rec.Code)
	}

	//******** TEST UPDATE DECK ENDPOINT **********
	expected := fmt.Sprintf(`{
		"id": "%v",
		"name": "My Deck",
		"tags": ["cs", "other"],
		"isFavorite": true,
		"cards": [
			{
				"id": "card1",
				"frontText": "front",
				"backText": "back",
				"isFavorite": false
			},
			{
				"id": "card2",
				"frontText": "front2",
				"backText": "back2",
				"isFavorite": true
			},
			{
				"id": "card3",
				"frontText": "front3",
				"backText": "back3",
				"isFavorite": false
			}
			
		]
	}`, deckID)

	dst := &bytes.Buffer{}
	if err := json.Compact(dst, []byte(expected)); err != nil {
		panic(err)
	}
	formattedReqString := dst.String()
	reqBody := strings.NewReader(formattedReqString)

	var endpoint string = fmt.Sprintf("/api/updatedeck/%v", deckID)

	//reqBody := strings.NewReader(expected)
	req, err = http.NewRequest(http.MethodPut, endpoint, reqBody)

	if err != nil {
		t.Fatal(err)
	}

	rec = httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	//Check that the response Codes are correct.
	if rec.Code != http.StatusCreated {
		t.Errorf("expected status code %d but got %d", http.StatusCreated, rec.Code)
	}

	//Check that the response value is the same as expected.
	if rec.Body.String() != fmt.Sprintf("%v\n", formattedReqString) {
		t.Errorf("handler returned unexpected body: got %v want %v", rec.Body.String(), fmt.Sprintf("%v\n", formattedReqString))
	}

	//******** TEST GET DECK ENDPOINT **********
	expected = fmt.Sprintf(`{
		"id": "%v",
		"name": "My Deck",
		"tags": ["cs", "other"],
		"isFavorite": true,
		"cards": [
			{
				"id": "card1",
				"frontText": "front",
				"backText": "back",
				"isFavorite": false
			},
			{
				"id": "card2",
				"frontText": "front2",
				"backText": "back2",
				"isFavorite": true
			},
			{
				"id": "card3",
				"frontText": "front3",
				"backText": "back3",
				"isFavorite": false
			}
			
		]
	}`, deckID)
	dst = &bytes.Buffer{}
	if err := json.Compact(dst, []byte(expected)); err != nil {
		panic(err)
	}
	formattedExpectedString := fmt.Sprintf("%v\n", dst.String())

	endpoint = fmt.Sprintf("/api/getdeck/%v", deckID)
	req, err = http.NewRequest(http.MethodGet, endpoint, nil)

	if err != nil {
		t.Fatal(err)
	}

	rec = httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	//Check that the response Codes are correct.
	if rec.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, rec.Code)
	}

	//Check that the response value is the same as expected.
	if rec.Body.String() != formattedExpectedString {
		t.Errorf("handler returned unexpected body: got %v want %v", rec.Body.String(), formattedExpectedString)
	}

	//******** TEST REMOVE DECK ENDPOINT **********
	endpoint = fmt.Sprintf("/api/removedeck/%v", deckID)
	req, err = http.NewRequest(http.MethodDelete, endpoint, nil)

	if err != nil {
		t.Fatal(err)
	}

	rec = httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	//Check that the response Codes are correct.
	if rec.Code != http.StatusAccepted {
		t.Errorf("expected status code %d but got %d", http.StatusAccepted, rec.Code)
	}

}

func TestEndpointResponseCodes(t *testing.T) {

	r := router.SetupRouter()

	tests := []struct {
		name       string
		endpoint   string
		method     string
		reqBody    io.Reader
		statusCode int
	}{
		{
			name:       "Create Deck",
			endpoint:   "/api/createdeck",
			method:     http.MethodGet,
			reqBody:    nil,
			statusCode: http.StatusCreated,
		},
		{
			name:       "Get Deck by ID",
			endpoint:   "/api/getdeck/02",
			method:     http.MethodGet,
			reqBody:    nil,
			statusCode: http.StatusOK,
		},
		{
			name:       "Get Deck by ID - ID Not Found",
			endpoint:   "/api/getdeck/100",
			method:     http.MethodGet,
			reqBody:    nil,
			statusCode: http.StatusNotFound,
		},
		{
			name:       "Get All Decks",
			endpoint:   "/api/getalldecks",
			method:     http.MethodGet,
			reqBody:    strings.NewReader(`{"name":"John Doe","email":"john@example.com"}`),
			statusCode: http.StatusOK,
		},
		{
			name:     "Update Deck",
			endpoint: "/api/updatedeck/02",
			method:   http.MethodPut,
			reqBody: strings.NewReader(`{
				"id": "02",
				"name": "My Deck",
				"tags": ["cs", "other"],
				"isFavorite": true,
				"cards": [
					{
						"id": "card1",
						"frontText": "front",
						"backText": "back",
						"isFavorite": false
					},
					{
						"id": "card2",
						"frontText": "front2",
						"backText": "back2",
						"isFavorite": true
					},
					{
						"id": "card3",
						"frontText": "front3",
						"backText": "back3",
						"isFavorite": false
					}
					
				]
			}`),
			statusCode: http.StatusCreated,
		},
		{
			name:       "Update Deck - Specific Parameter",
			endpoint:   "/api/updatedeckinfo/02/isFavorite/false",
			method:     http.MethodPut,
			reqBody:    nil,
			statusCode: http.StatusCreated,
		},
		{
			name:       "Get Deck List",
			endpoint:   "/api/getdecklist/My%20Deck",
			method:     http.MethodGet,
			reqBody:    nil,
			statusCode: http.StatusOK,
		},
		{
			name:     "Create User",
			endpoint: "/api/createuser",
			method:   http.MethodPost,
			reqBody: strings.NewReader(`{
				"username": "test",
				"id": "",
				"decks": [
					{
						"ID": "03",
						"Name": "My Deck",
						"Topic": "CS",
						"IsFavorite": true,
						"cards": [
							{
								"id": "card1",
								"frontText": "front",
								"backText": "back",
								"isFavorite": false
							},
							{
								"id": "card2",
								"frontText": "front2",
								"backText": "back2",
								"isFavorite": true
							},
							{
								"id": "card3",
								"frontText": "front3",
								"backText": "back3",
								"isFavorite": false
							}
						]
					}
				]
			}`),
			statusCode: http.StatusCreated,
		},
		{
			name:       "Get User",
			endpoint:   "/api/getuser/dO4U56oHsX8gRNTdqaim",
			method:     http.MethodGet,
			reqBody:    nil,
			statusCode: http.StatusOK,
		},
		{
			name:       "Update User",
			endpoint:   "/api/updateuser/dO4U56oHsX8gRNTdqaim/username/testa",
			method:     http.MethodPut,
			reqBody:    nil,
			statusCode: http.StatusCreated,
		},
		// add more test cases here
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req, err := http.NewRequest(tc.method, tc.endpoint, tc.reqBody)
			if err != nil {
				t.Fatal(err)
			}

			rec := httptest.NewRecorder()
			r.ServeHTTP(rec, req)

			if rec.Code != tc.statusCode {
				t.Errorf("expected status code %d but got %d", tc.statusCode, rec.Code)
			}
		})
	}
}

package spacelist

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type peopleInSpace struct {
	Number int          `json:"number"`
	People []*Astronaut `json:"people"`
}

// FetchAstronauts grabs a list of astronauts from the internet and
// populates their fields.
func FetchAstronauts() (astronauts []*Astronaut, err error) {
	resp, err := http.Get("http://www.howmanypeopleareinspacerightnow.com/peopleinspace.json")
	if err != nil {
		return
	}
	defer resp.Body.Close()
	contents, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	var data peopleInSpace
	err = json.Unmarshal(contents, &data)
	astronauts = data.People

	for _, ast := range astronauts {
		ast.Days = ast.DaysInSpace()
		ast.Gender, err = ast.LookupGender()
		if err != nil {
			return nil, err
		}
	}

	return
}

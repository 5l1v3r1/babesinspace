package spacelist

import (
	"bytes"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"golang.org/x/net/html"
)

type Gender int

const (
	Male Gender = iota
	Female
)

// An Astronaut stores information about somebody in space.
type Astronaut struct {
	Name    string `json:"name"`
	Country string `json:"country"`

	TwitterURL string `json:"twitter"`
	PhotoURL   string `json:"biophoto"`
	BioURL     string `json:"biolink"`

	LaunchDate   string `json:"launchdate"`
	LocationName string `json:"location"`
}

// DaysInSpace computes the number of days since the astronaut's launch date.
func (a Astronaut) DaysInSpace() int {
	reg := regexp.MustCompile("0*([0-9]*)-0*([0-9]*)-0*([0-9]*)")
	match := reg.FindStringSubmatch(a.LaunchDate)
	if match == nil {
		return 0
	}
	year, _ := strconv.Atoi(match[1])
	month, _ := strconv.Atoi(match[2])
	day, _ := strconv.Atoi(match[3])
	t := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	elapsed := time.Now().Sub(t)
	return int(elapsed / (time.Hour * 24))
}

// LookupGender finds the astronaut's gender.
// This will make a web request in the process.
func (a Astronaut) LookupGender() (Gender, error) {
	res, err := http.Get(a.BioURL)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()
	fragment, err := html.ParseFragment(res.Body, nil)
	if err != nil {
		return 0, err
	}
	var b bytes.Buffer
	for _, n := range fragment {
		b.WriteString(nodeInnerText(n))
	}
	bio := b.String()
	womenWords := []string{"she", "her", "hers"}
	menWords := []string{"he", "him", "his"}
	womanScore := 0
	manScore := 0
	for _, w := range womenWords {
		womanScore += countWordOccurrences(bio, w)
	}
	for _, w := range menWords {
		manScore += countWordOccurrences(bio, w)
	}
	if womanScore > manScore {
		return Female, nil
	} else {
		return Male, nil
	}
}

func nodeInnerText(n *html.Node) string {
	if n.Type == html.TextNode {
		return n.Data
	}

	var res bytes.Buffer
	n = n.FirstChild
	for n != nil {
		res.WriteString(nodeInnerText(n))
		n = n.NextSibling
	}
	return res.String()
}

func countWordOccurrences(s, sep string) int {
	r := regexp.MustCompile("\\s" + s + "[.|\\?|!|\\s|$]")
	return len(r.FindAllString(s, -1))
}

package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/unixpickle/babesinspace/spacelist"
)

func main() {
	if len(os.Args) != 2 {
		log.Fatalln("Usage: babesinspace <port>")
	}

	var astronautsLock sync.RWMutex
	astronauts := make([]*spacelist.Astronaut, 1)

	go func() {
		for {
			a, err := spacelist.FetchAstronauts()
			if err == nil {
				astronautsLock.Lock()
				astronauts = a
				astronautsLock.Unlock()
			} else {
				log.Println("Failed to fetch astronauts:", err)
			}
			time.Sleep(time.Hour)
		}
	}()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			astronautsLock.RLock()
			contents, _ := ioutil.ReadFile("assets/index.html")
			encoded, _ := json.Marshal(astronauts)
			s := strings.Replace(string(contents), "[/*ASTRONAUTS HERE*/]",
				string(encoded), -1)
			s = strings.Replace(s, "<!--ASTRONAUTS COUNT-->",
				strconv.Itoa(len(astronauts)), -1)
			astronautsLock.RUnlock()

			w.Header().Set("Content-Type", "text/html")
			w.Write([]byte(s))
		} else {
			p := strings.Replace(path.Clean(r.URL.Path), "..", "", -1)
			http.ServeFile(w, r, path.Join("assets", p))
		}
	})

	err := http.ListenAndServe(":"+os.Args[1], nil)
	if err != nil {
		log.Fatalln("Error listening:", err)
	}
}

// Package main implements a simple static file server for production deployment.
package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"google3/base/go/flag"
	"google3/base/go/log"
	"google3/base/go/runfiles"
)

var (
	port       = flag.String("port", "", "The port to listen on")
	staticPath = flag.String("static_path", "google3/devtools/ai/agents/airline_customer_sim/web/static", "The relative path to the static files in runfiles")
)

func main() {
	flag.Parse()

	// Resolve static path using runfiles.
	resolvedPath := runfiles.Path(*staticPath)

	// Cloud Run provides the port via the PORT environment variable.
	if *port == "" {
		*port = os.Getenv("PORT")
	}
	if *port == "" {
		*port = "8080"
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/bundle.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		http.ServeFile(w, r, runfiles.Path("google3/devtools/ai/agents/airline_customer_sim/web/bundle.js"))
	})

	// Serve static files.
	fileServer := http.FileServer(http.Dir(resolvedPath))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		path := filepath.Join(resolvedPath, r.URL.Path)
		info, err := os.Stat(path)
		if os.IsNotExist(err) || info.IsDir() {
			// Serve index.html for all non-existent paths (SPA fallback).
			http.ServeFile(w, r, filepath.Join(resolvedPath, "index.html"))
			return
		}
		fileServer.ServeHTTP(w, r)
	})

	log.Infof("Listening on port %s", *port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", *port), mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

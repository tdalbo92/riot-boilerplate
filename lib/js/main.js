/* Copyright IBM Corp. 2015 Licensed under the Apache License, Version 2.0 */

// Main entry point to our application.  Register the data stores with Dispatcher and mount the main home tag.

var riot       = require("riot"),
    Polyglot   = require("node-polyglot"),
    Dispatcher = require("./Dispatcher.js"),
    MainStore  = require("./MainStore.js");


// Initialize our data stores
    
var mainStore = new MainStore();
    
    
// Get Dispatcher all set up
    
Dispatcher.addStore(mainStore);


// User language detection and internationalization

var browserLang = navigator.language || navigator.userLanguage;

complLang = browserLang.split('-');

lang    = complLang[0];
dialect = complLang[1];


var stringBundleAddress = './strings/en.json';

fetch(stringBundleAddress)
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
        polyglot  = new Polyglot({phrases: data});
    }).catch(function(error) {
        console.log('Language bundle request failed', error);
    })
    .then(function(data) {
        riot.mount("app");
    });
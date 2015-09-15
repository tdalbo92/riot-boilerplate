/* Copyright IBM Corp. 2015 Licensed under the Apache License, Version 2.0 */

var riot          = require("riot"),
    action        = require("./action.js"),
    constants     = require("./constants.js");

// ConversationStore definition.
// Flux stores house application logic and state that relate to a specific domain.
function MainStore() {
    riot.observable(this);

    var self = this;

	/**
	 * Listens for a welcome action and responds with a broadcast
	 */
    self.on(action.WELCOME, function() {
        self.trigger(action.WELCOME_BROADCAST);
    });
}

if (typeof(module) !== 'undefined') module.exports = MainStore;
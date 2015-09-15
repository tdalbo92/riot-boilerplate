/* Copyright IBM Corp. 2015 Licensed under the Apache License, Version 2.0 */

// For my sanity, please keep this alphabetical
var action = {
    "WELCOME" : "request_welcome_message",
    "WELCOME_BROADCAST" : "welcome_message_broadcasted"
};

// Make these guys unique from the other actions
Object.keys(action).forEach(function(value, index) {
    action[value] += "_action";
});

if (typeof(module) !== 'undefined') module.exports = action;
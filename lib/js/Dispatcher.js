/* Copyright IBM Corp. 2015 Licensed under the Apache License, Version 2.0 */

var Dispatcher = {
  _stores: [],
  addStore: function(store) {
    this._stores.push(store);
  }
};

['on','one','off','trigger'].forEach(function(api){
  Dispatcher[api] = function() {
    var args = [].slice.call(arguments);
    this._stores.forEach(function(el){
      el[api].apply(null, args);
    });
  };
});

if (typeof(module) !== 'undefined') module.exports = Dispatcher;
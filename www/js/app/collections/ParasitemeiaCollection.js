// ParasitemeiaCollection.js
// -------------
define(["jquery","backbone", "backbone.localStorage", "models/ParasitameiaModel"],

  function($, Backbone, LocalStorage, ParasitameiaModel) {

    // Creates a new Backbone Collection class object
    var ParasitemeiaCollection = Backbone.Collection.extend({

    	// currently use local storage until indexeddb or web sql comes back
    	localStorage: new Backbone.LocalStorage("ParasitemeiaCollection"), // Unique name within your app.

      	// Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      	model: ParasitameiaModel

    });

    // Returns the Model class
    return ParasitemeiaCollection;

  }

);
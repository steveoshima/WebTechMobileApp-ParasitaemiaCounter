// StrainCollection.js
// -------------
define(["jquery","backbone", "backbone.localStorage", "models/StrainModel"],

  function($, Backbone, LocalStorage, Model) {

    // Creates a new Backbone Collection class object
    var StrainCollection = Backbone.Collection.extend({

    	// currently use local storage until indexeddb or web sql comes back
    	localStorage: new Backbone.LocalStorage("StrainCollection"), // Unique name within your app.

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Model

    });

    // Returns the Model class
    return StrainCollection;

  }

);
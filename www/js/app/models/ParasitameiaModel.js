// Model.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var ParasitameiaModel = Backbone.Model.extend({

            // Model Constructor
            initialize: function() {

            },

            // Default values for all of the Model attributes
            defaults: {
                Name: "blank",
                DateCreated: new Date(),
                Type: 1,
                Trophs: 0,
                Rings: 0,
                Infected: 0,
                Uninfected: 0
            },

            // parse: function(response) {
            //     return response.results;
            // },

            // Get's called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return ParasitameiaModel;

    }

);
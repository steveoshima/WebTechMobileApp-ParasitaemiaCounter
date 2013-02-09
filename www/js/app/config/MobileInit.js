// MobileInit.js
// -------------
require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "./js",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // --------------
      "jquery": "libs/jquery",

      "jquerymobile": "libs/jquery.mobile",

      "underscore": "libs/lodash",

      "backbone": "libs/backbone",

      // Plugins
      // -------
      "backbone.validateAll": "libs/plugins/backbone.validateAll",

      "backbone.localStorage": "libs/plugins/backbone.localStorage",

      "text": "libs/plugins/text",

      // Application Folders
      // -------------------
      "collections": "app/collections",

      "models": "app/models",

      "routers": "app/routers",

      "templates": "app/templates",

      "views": "app/views",

      // Helpers
      // -------------------
      "helpers": "libs/helpers",
      "moment": "libs/moment.min",
      "iscroll": "libs/iscroll",
      "fastclick": "libs/fastclick"

  },

  // Sets the dependency and shim configurations
  // - Helpful for including non-AMD compatible scripts and managing dependencies
  shim: {

      // jQuery Mobile
      "jquerymobile": ["jquery"],

      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery
        "deps": ["underscore", "jquery"],

        // Exports the global window.Backbone object
        "exports": "Backbone"

      },

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"],

      "backbone.localStorage": {
        "deps": ["backbone"],

        "exports": "LocalStorage"
      },


  }

});

// Include Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "backbone", "helpers", "routers/MobileRouter", 
         "jquerymobile", "backbone.validateAll", "moment", "iscroll", "fastclick"],

  function($, Backbone, Helpers, MobileRouter) {

    // Prevents all anchor click handling
    $.mobile.linkBindingEnabled = false;

    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;

    // not needed
    $.mobile.ajaxEnabled = false; 

    // performance improvements
    $.mobile.defaultPageTransition   = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.buttonMarkup.hoverDelay = 0;

    // load up js prototypes
    new Helpers.setupPrototypes();

    // Instantiates a new Mobile Router instance
    window.mobileApp = new MobileRouter();

    //navigator.notification.alert("mobile app");
    window.addEventListener('load', function() {
      new FastClick(document.body);
    }, false);

  }

);
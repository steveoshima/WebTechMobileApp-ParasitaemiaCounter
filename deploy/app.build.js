// Node.js - Require.js Build Script

// To run the build type the following: node app.build.js

// node modules
var wrench = require('wrench'),
    util = require('util'),
    _fs = require('fs'),
    uglyfyJS = require('uglify-js');

// Loads the Require.js Optimizer
var requirejs = require('../public/js/libs/r.js');

// Sets up the basic configuration
var baseConfig = {

  // All modules are located relative to this path
  baseUrl: "../public/js/",

  // Sets path names and paths for modules relative to the baseUrl
  paths: {

    "mobile": "app/config/MobileInit",

    "desktop": "app/config/DesktopInit"

  },

  // Wraps all scripts in an IIFE (Immediately Invoked Function Expression)
  // (function() { + content + }());
  wrap: true,
    
  // The optimized build file will use almond.js (AMD shim) instead of the larger Require.js
  name: "libs/almond",

  // Removes third-party license comments
  preserveLicenseComments: false,

  // Uses uglify.js for minification
  optimize: "uglify"
 
 };

// Creates an array of build configs, the baseConfig will
// be mixed into both the mobile and desktop builds below.

var configs = [

    {

        // Tells Require.js to look at mobileInit.js for all mobile shim and path configurations
        mainConfigFile: "../public/js/app/config/MobileInit.js",

        // Points to mobileInit.js (Remember that "mobile" is the module name for mobileInit.js)
        include: ["mobile"],

        // The optimized mobile build file will put into the app directory
        out: "../public/js/app/config/MobileInit.min.js"

    },

    {

        // Tells Require.js to look at desktopInit.js for all desktop shim and path configurations
        mainConfigFile: "../public/js/app/config/DesktopInit.js",

        // Points to desktopInit.js (Remember that "desktop" is the module name for desktopInit.js)
        include: ["desktop"],

        // The optimized desktop build file will put within the app directory
        out: "../public/js/app/config/DesktopInit.min.js"

    }

];

// Function used to mix in baseConfig to a new config target
function mix(target) {

    for (var prop in baseConfig) {

        if (baseConfig.hasOwnProperty(prop)) {

            target[prop] = baseConfig[prop];

        }

    }

    return target;

}

//Create a runner that will run a separate build for each item
//in the configs array. Thanks to @jwhitley for this cleverness
var runner = configs.reduceRight(function(prev, currentConfig) {

  return function (buildReportText) {

    requirejs.optimize(mix(currentConfig), prev);

  };

}, function(buildReportText) {

    console.log(buildReportText);

});

console.log("Building... this might take a few seconds");

//Run the builds
runner();

// uglify the cordova.js as outside of requirejs
// function uglify(srcPath, distPath) {
//   var FILE_ENCODING = 'utf-8';
//    var jsp = uglyfyJS.parser,
//     pro = uglyfyJS.uglify,
//     ast = jsp.parse( _fs.readFileSync(srcPath, FILE_ENCODING) );
 
//    ast = pro.ast_mangle(ast);
//    ast = pro.ast_squeeze(ast);
 
//    _fs.writeFileSync(distPath, pro.gen_code(ast), FILE_ENCODING);
//    console.log('Cordova uglify');
// }
// uglify('../public/js/libs/cordova-2.2.0.js', '../public/js/libs/cordova-2.2.0.min.js');


//copy to xcode www - dev code was in differnt location than xcode proj code, remember to change if code moved.
wrench.copyDirSyncRecursive('../public/', '/Users/stevensagar/Development/mobile/xcode/paracounter/www/');

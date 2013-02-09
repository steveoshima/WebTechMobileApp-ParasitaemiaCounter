// InfoView.js
// -------
define(["jquery", "backbone", 
        "text!templates/info.html"],

    function($, Backbone,
            template){

        var InfoView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".content",

            // View constructor
            initialize: function() {

                // found that event handlers would persist between views
                this._destroyEvents();

                // Calls the view's render method
                this.render();
            },

            // Renders the view's template to the UI
            render: function() {             
                this.$el.html(_.template(template));

                return this;
            },

            popReset: function(e) {
                e.preventDefault();
                var passedView = this; // called from header so default would be a differnt view so .call to fix to this view.
                $("#popReset").popup("open");
                $("#popReset").unbind();
                $("#popReset").bind({
                    popupafteropen: function(event, ui) {
                            // hack to allow popup events to work, popup el is in dom parent so cant use view events
                            $("#btnReset").on("tap", function(e, ui) {
                                e.stopImmediatePropagation();
                                passedView.clearStrains.call(passedView, e);
                            });
                            $("#resetText").on("keypress", function(e, ui) {
                                var code = (e.keyCode ? e.keyCode : e.which);
                                if (code == 13) {
                                    passedView.clearStrains.call(passedView, e);
                                    return false;                                                                                                       
                                }
                            });
                    }
                });
            },

            // View Event Handlers
            events: {
                
            },

            clearStrains: function(e) {
                var view = this;
                if ($("#resetText").val().toUpperCase() === "WIPEALL") {
                    $("#resetText").val("");

                    //remove parasiteamias
                    view.options.paraCollection.fetch({
                        success: function() {
                            var length = view.options.paraCollection.length; 
                            for (var i = length - 1; i >= 0; i--) { 
                                view.options.paraCollection.at(i).destroy();
                            }
                        }
                    });
                    //remove strains
                    view.options.strainCollection.fetch({
                        success: function() {
                            var length = view.options.strainCollection.length; 
                            for (var i = length - 1; i >= 0; i--) { 
                                view.options.strainCollection.at(i).destroy();
                            }
                        }
                    });

                    $("#popReset").popup("close");
                    console.log("clear");
                }
            },

            _destroyEvents: function() {
                this.undelegateEvents();
                this.$el.removeData().unbind(); 
            }

        });

        // Returns the View module
        return InfoView;
    }
);
// HeaderView.js
// -------
define(["jquery", "backbone", "text!templates/heading.html"],

    function($, Backbone, template){

        var HeaderView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "header",

            // View constructor
            initialize: function() {
                
                // found that event handlers would persist between views
                this._destroyEvents();
                // Calls the view's render method
                this.render();
            },

            // View Event Handlers
            events: function() {
                var events_hash = {
                    // insert all the events that go here regardless of dynamic
                };
                if (this.options.left && this.options.left.navevent) {
                    _.extend(events_hash, {"tap .ui-btn-left": this.options.left.navevent }); 
                }
                if (this.options.right && this.options.right.navevent) {
                    _.extend(events_hash, {"tap .ui-btn-right": this.options.right.navevent });
                }
                return events_hash;
            },

            // Renders the view's template to the UI
            render: function() {
                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, this.options);

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template).parent().trigger('create');

                //console.log(jQuery._data( $(".ui-btn-right").get(0), "events" ));

                // Maintains chainability
                return this;
            },

            _destroyEvents: function() {
                this.undelegateEvents();
                this.$el.removeData().off(); 
            }

        });

        // Returns the View class
        return HeaderView;
    }
);
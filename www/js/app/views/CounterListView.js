// StrainListView.js
// -------
define(["jquery", "backbone", 
        "models/ParasitameiaModel",
        "text!templates/counterlist.html",
        "views/CounterRowView"],

    function($, Backbone, 
            ParasitameiaModel,
            template,
            RowView){

        var StrainListView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".content",

            // View constructor
            initialize: function() {

                // found that event handlers would persist between views
                this._destroyEvents();

                //this.listenTo(this.collection, "reset", this.renderList);
                this.collection.on("reset", this.renderList, this);

                // Calls the view's render method
                this.render();

                // test data

                // var testDate1 = new Date();
                // testDate1.setISO8601('2013-01-05T09:09:03.000Z');

                // var testDate2 = new Date();
                // testDate2.setISO8601('2013-01-06T10:10:03.000Z');

                // this.collection.reset([
                //     new ParasitameiaModel({ 
                //         DateCreated: testDate1,
                //         Infected: 15,
                //         Uninfected: 150,
                //     }),
                //     new ParasitameiaModel({ 
                //         DateCreated: testDate2,
                //         Infected: 9,
                //         Uninfected: 90,
                //     })
                // ]);

            },

            // Renders the view's template to the UI
            render: function() {

                // Setting the view's template property using the Underscore template method
                this.template = _.template(template);                

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);

                // Maintains chainability
                return this;
            },

            renderList: function() {
                var view = this;
                this.collection.each(function(parasitameiaModel) {
                    var rowView = new RowView({ 
                        model: parasitameiaModel, 
                        strainId: (view.model) ? view.model.id : null // from Strain list or History
                    });
                    this.$("#list").append(rowView.render().el);
                });

                this.$el.trigger('create');                
            },

            popReset: function(e) {
                e.preventDefault();
                $("#popReset").popup("open", { positionTo: ".ui-header"});
            },

            popCounterChoice: function(e) {
                e.preventDefault();
                var passedView = this;
                $("#popCounterChoice").unbind().bind({
                    popupafteropen: function(event, ui) {
                            // hack to allow popup events to work, el is in dom parent so cant use view events
                            $("#btnCounter1").off("tap");
                            $("#btnCounter1").on("tap", function(e, ui) {
                                e.stopImmediatePropagation();
                                mobileApp.navigate("calc3button?=" + passedView.model.id, { trigger: true });
                            });
                            $("#btnCounter2").off("tap");
                            $("#btnCounter2").on("tap", function(e, ui) {
                                e.stopImmediatePropagation();
                                mobileApp.navigate("calc2button?=" + passedView.model.id, { trigger: true });
                            });
                    }
                }).popup("open", { positionTo: ".ui-header"});
                
            },

            // View Event Handlers
            events: function() {
                console.log(this.model.get("Name"));
                var view = this;
                var events_hash = {
                    // insert all the events that go here regardless of dynamic
                };
                // hack to allow popup events
                $("#btnReset").on("tap", function(e, ui) {
                    e.stopImmediatePropagation();
                    view.clearStrains(e);
                });
                $("#resetText").on("keypress", function(e, ui) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    if (code == 13) {
                        view.clearStrains(e);
                        return false;
                    }
                });

                return events_hash;
            },

            clearStrains: function(e) {
                console.log("clear");
                if ($("#resetText").val().toUpperCase() === "WIPE") {
                    $("#resetText").val("");
                }
            },

            _destroyEvents: function() {
                this.undelegateEvents();
                this.$el.removeData().unbind();
            }

        });

        // Returns the View module
        return StrainListView;
    }
);
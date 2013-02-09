// CounterView.js
// -------
define(["jquery", "backbone", 
        "text!templates/counterrow1.html", "text!templates/counterrow2.html"],

    function($, Backbone,
            template1, template2){

        var CounterRowView = Backbone.View.extend({

            // The DOM Element associated with this view
            tagName: "li",

            // View constructor
            initialize: function() {

                this.model.on("change", this.render, this);

                // Calls the view's render method
                this.render();

            },

            // Renders the view's template to the UI
            render: function() {

                var template = (this.options.strainId) ? template2 : template1
                this.template = _.template(template);

                var viewModel = {
                    Name: this.model.get("Name"),
                    DateCreated: this.model.get("DateCreated")
                };       

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template(viewModel));

                // Maintains chainability
                return this;
            },


            // View Event Handlers
            events: {
                "tap" : "showDetail",
                "swiperight": "showRowDelete",
                "tap .btnDelete": "deleteCount"
            },

            showDetail: function(e) {
                e.preventDefault();
                mobileApp.navigate("historyitem?=" + this.model.id + "&strainId=" + this.options.strainId , { trigger: true });
            },

            showRowDelete: function(e) {
                e.preventDefault();
                console.log("showdelete");
                this.$el.find(".slide-delete").show();
            },

            deleteCount: function(e) {
                e.preventDefault();               
                
                var view = this;
                this.model.destroy({
                    success: function() {
                        //could re-render collection but would lose scroll position so removing view                 
                        view.remove();
                        $('#list').listview('refresh');
                    }
                });      
            },

        });

        // Returns the View module
        return CounterRowView;

    }

);
// CounterView.js
// -------
define(["jquery", "backbone", 
        "text!templates/counterringstrophs.html","text!templates/counter.html"],

    function($, Backbone,
            templateRingsTroph, templateBasic){

        var CounterView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".content",

            // View constructor
            initialize: function() {

                $("[data-role='content']").addClass("ui-content"); //add padding back
                
                this.model.on("change", this.render, this);

                // Calls the view's render method
                this.render();
            },

            // Renders the view's template to the UI
            render: function() {

                var template = (this.model.get("Type") === 1) ? templateBasic : templateRingsTroph;
                var viewModel = (this.model.get("Type") === 1) ? this.createViewModelBasic(this.model) : this.createViewModelRT(this.model)
                
                this.template = _.template(template);                
                this.$el.html(this.template(viewModel));

                return this;
            },

            createViewModelBasic: function(model) {
                var i = model.get("Infected"),
                    u = model.get("Uninfected");

                var viewModel = {
                    Name: model.get("Name"),
                    DateCreated: model.get("DateCreated"),
                    Infected: i,
                    Uninfected: u,
                    I: (100 / (i + u) * i).toFixed(1) || 0,
                    U: (100 / (i + u) * u).toFixed(1) || 0,
                    Total: i + u
                }
                return viewModel;
            },

            createViewModelRT: function(model) {
                var r = model.get("Rings"),
                    t = model.get("Trophs"),
                    u = model.get("Uninfected");

                var viewModel = {
                    Name: model.get("Name"),
                    DateCreated: model.get("DateCreated"),
                    Infected: t + r,
                    Trophs: t,
                    Rings: r,
                    Uninfected: u,
                    I: ((t + r) / ((t + r) + u) * 100).toFixed(1) || 0,
                    T: ((t / ((t + r) + u)) * 100).toFixed(1) || 0,
                    R: ((r / ((t + r) + u)) * 100).toFixed(1) || 0,
                    U: (u / ((t + r) + u) * 100).toFixed(1) || 0,
                    Total: (t + r) + u 
                }
                return viewModel;
            },


            // View Event Handlers
            events: {
                
            },


        });

        // Returns the View module
        return CounterView;

    }

);
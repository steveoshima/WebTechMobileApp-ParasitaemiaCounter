// View.js
// -------
define(["jquery", "backbone", "models/ParasitameiaModel", "text!templates/calc2button.html"],

    function($, Backbone, Model, template){

        var Calc2ButtonView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".content",

            // View constructor
            initialize: function() {

                // found that event handlers would persist between views
                this._destroyEvents();

                this.model.set("Type", 1); //two buttons type

                this.model.on("change", this.renderQuick, this);

                // Calls the view's render method
                this.render();

            },

            // Renders the view's template to the UI
            render: function() {

                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, this.createViewModel(this.model));

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template).trigger('create');

                // Maintains chainability
                return this;

            },

            renderQuick: function() {
                var vm = this.createViewModel(this.model);

                this.$el.find("#i").text(vm.I.toFixed(1)+"%");
                this.$el.find("#u").text(vm.U.toFixed(1)+"%");
                this.$el.find("#total").text(vm.Total);

                this.$el.find("#ib").text(vm.Infected);
                this.$el.find("#ub").text(vm.Uninfected);
            },

            createViewModel: function(model) {
                var i = model.get("Infected"),
                    u = model.get("Uninfected");

                var viewModel = {
                    Infected: i,
                    Uninfected: u,
                    I: 100 / (i + u) * i || 0,
                    U: 100 / (i + u) * u || 0,
                    Total: i + u
                }
                return viewModel;
            },

            popSave: function(e) {
                e.preventDefault();
                var passedView = this;
                $("#popSave").unbind().bind({
                    popupafteropen: function(event, ui) {
                            // hack to allow popup events to work, el is in dom parent so cant use view events
                            $("#btnSave").off("tap");
                            $("#btnSave").on("tap", function(e, ui) {
                                passedView.saveCount.call(passedView, e, ui);
                            });
                    }
                }).popup("open", { positionTo: ".ui-header"});
            },

            reset: function(e) {
                e.preventDefault();
                this.model.set({
                    "Infected": 0,
                    "Uninfected": 0
                });
            },

            // View Event Handlers
            events: {
                "tap #btnInfected": "addInfected",
                "tap #btnUninfected": "addUninfected"
            },

            addInfected: function(e) {
                e.stopPropagation();
                e.preventDefault();
                this.model.set("Infected", this.model.get("Infected") + 1)
            },

            addUninfected: function(e) {
                e.stopPropagation();
                e.preventDefault();
                this.model.set("Uninfected", this.model.get("Uninfected") + 1)
            },

            saveCount: function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                var view = this;
                this.model.set("DateCreated", new Date(), {silent: true});
                
                this.collection.create(this.model.attributes, {
                    wait: true,
                    success: function() {
                        mobileApp.navigate("strain?=" + view.options.strainId, { trigger: true });
                    }
                });
            },

            _destroyEvents: function() {
                this.undelegateEvents();
                this.$el.removeData().unbind();
                $("[data-role='content']").addClass("ui-content"); //add padding back
            }
        });

        // Returns the View module
        return Calc2ButtonView;

    }

);

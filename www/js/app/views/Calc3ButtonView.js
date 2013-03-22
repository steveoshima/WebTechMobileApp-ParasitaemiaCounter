// View.js
// -------
define(["jquery", "backbone", "models/ParasitameiaModel", "text!templates/calc3button.html"],

    function($, Backbone, Model, template){

        var Calc3ButtonView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".content",

            // View constructor
            initialize: function() {

                // found that event handlers would persist between views
                this._destroyEvents();

                this.model.set("Type", 2); //three button type

                //this.listenTo(this.model, "change", this.renderQuick);
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

                this.$el.find("#t").text(vm.T.toFixed(1)+"%");
                this.$el.find("#r").text(vm.R.toFixed(1)+"%");
                this.$el.find("#i").text(vm.I.toFixed(1)+"%");
                this.$el.find("#u").text(vm.U.toFixed(1)+"%");
                this.$el.find("#total").text(vm.Total);

                this.$el.find("#rb").text(vm.Rings);
                this.$el.find("#tb").text(vm.Trophs);
                this.$el.find("#ub").text(vm.Uninfected);
            },

            createViewModel: function(model) {
                var r = model.get("Rings"),
                    t = model.get("Trophs"),
                    u = model.get("Uninfected");

                var viewModel = {
                    Infected: t + r,
                    Trophs: t,
                    Rings: r,
                    Uninfected: u,
                    I: ((t + r) / ((t + r) + u) * 100) || 0,
                    T: ((t / ((t + r) + u)) * 100) || 0,
                    R: ((r / ((t + r) + u)) * 100) || 0,
                    U: (u / ((t + r) + u) * 100) || 0,
                    Total: (t + r) + u 
                }
                return viewModel;
            },

            popSave: function(e) {
                e.preventDefault();
                var passedView = this; // called from header so default would be a differnt view so .call to fix to this view.
                $("#popSave").unbind().bind({
                    popupafteropen: function(event, ui) {
                            // hack to allow popup events to work, el is in dom parent so cant use view events
                            $("#btnSave").off("tap");
                            $("#btnSave").on("tap", function(e, ui) {
                                passedView.saveCount.call(passedView, e, ui);
                            });
                    }
                }).popup("open", { positionTo: ".ui-header"});;
            },

            reset: function(e) {
                e.preventDefault();
                this.model.set({
                    "Rings": 0,
                    "Trophs": 0,
                    "Uninfected": 0
                });
            },

            // View Event Handlers
            events: {
                "tap #btnRing": "addRing",
                "tap #btnTroph": "addTroph",
                "tap #btnUninfected": "addUninfected",
            },

            addRing: function(e) {
                e.preventDefault();
                this.model.set("Rings", this.model.get("Rings") + 1)
            },

            addTroph: function(e) {
                e.preventDefault();
                this.model.set("Trophs", this.model.get("Trophs") + 1)
            },

            addUninfected: function(e) {
                e.preventDefault();
                this.model.set("Uninfected", this.model.get("Uninfected") + 1)
            },

            saveCount: function(e) {
                var view = this;
                e.stopImmediatePropagation();

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

        // Returns the CalcView class
        return Calc3ButtonView;

    }

);

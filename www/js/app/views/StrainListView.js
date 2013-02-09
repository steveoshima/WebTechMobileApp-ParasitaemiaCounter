// StrainListView.js
// -------
define(["jquery", "backbone", 
        "models/ParasitameiaModel",
        "text!templates/strainlist.html",
        "views/StrainRowView",
        "models/StrainModel"],

    function($, Backbone, 
            ParasitameiaModel,
            template,
            RowView,
            StrainModel){

        var StrainListView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: '.content',

            // View constructor
            initialize: function() {

                //remove data-role="content" so padding iss ue doesnt turn up with iscroll
                this._iscrollFixes();

                // found that event handlers would persist between views
                this._destroyEvents();

                //this.listenTo(this.collection, "reset", this.renderList);
                this.collection.on("reset", this.renderList, this);
                this.collection.on("add", this.render, this);

                // Calls the view's render method
                this.render();

                                // test data

                 // var testDate1 = new Date();
                 // testDate1.setISO8601('2013-01-05T09:09:03.000Z');

                 // var testDate2 = new Date();
                 // testDate2.setISO8601('2013-01-06T10:10:03.000Z');

                 // this.collection.reset([
                 //     new StrainModel({ 
                 //        Name: "blaaaa",
                 //         DateCreated: testDate1,
                 //         StageOverride: false
                 //     }),
                 //     new StrainModel({
                 //        Name: "blaaaa2",
                 //         DateCreated: testDate2,
                 //         StageOverride: true
                 //     })
                 // ]);

            },

            // Renders the view's template to the UI
            render: function() {

                // Setting the view's template property using the Underscore template method
                this.template = _.template(template);                

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);

                // Load collection
                console.log(new Date())
                this.collection.fetch();

                // Maintains chainability
                return this;
            },

            renderList: function() {
                this.collection.each(this.renderRow);

                this.$el.trigger('create');

                this._iscrollRefresh();
                console.log(new Date())
            },

            renderRow: function(strain) {
                var rowView = new RowView({ model: strain });
                this.$("#list").append(rowView.render().el);
            },

            popAdd: function(e) {
                e.stopPropagation();
                e.preventDefault(); // needed for phonegap else popup flashes up and closes
                var passedView = this; // called from header so default would be a differnt view so .call to fix to this view.
                $("#popAdd").unbind().bind({
                    popupafteropen: function(popevent, ui) {
                            var $strainNameEl = $("#strainName");
                            //$strainNameEl.focus();
                            // hack to allow popup events to work, element is in dom parent so cant use view events
                            $("#btnAdd").on("click", function(event, ui) {
                                event.stopPropagation();
                                event.preventDefault();
                                passedView.addStrain(passedView, event);
                            });
                            $strainNameEl.on("keypress", function(event, ui) {
                                //event.stopPropagation();
                                //event.preventDefault();
                                var code = (event.keyCode ? event.keyCode : event.which);
                                if (code == 13) {
                                    passedView.addStrain(passedView, event);
                                    return false;                                                                                                       
                                }
                            });
                    }
                }).popup("open", { positionTo: ".ui-header"});
            },

            // View Event Handlers
            events: {
                    
            },

            addStrain: function() {
                $("#btnAdd").text("Saving");
                //$("#popAdd").popup("close");
                var $strainNameEl = $("#strainName");

                var name = $strainNameEl.val();
                if (name) {

                    var newModel = new StrainModel({ 
                        Name: name,
                        DateCreated: new Date()
                    });


                    this.collection.create(newModel.attributes, {
                        wait: true,
                        success: function(addedModel) {
                            $strainNameEl.val("");
                            mobileApp.navigate("strain?=" + addedModel.id, {trigger: true});
                        }
                    });
                }
            },

            _destroyEvents: function() {
                this.undelegateEvents();
                this.$el.removeData().off(); 
            },

            _iscrollFixes: function() {
                $("[data-role='content']").removeClass("ui-content"); //nasty padding
            },

            _iscrollRefresh: function() {
                setTimeout(function () {
                    window.iScroller.refresh();
                }, 0);
            }
            
        });

        // Returns the View module
        return StrainListView;

    }

);
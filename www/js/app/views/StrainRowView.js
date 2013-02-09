// View.js
// -------
define(["jquery", "backbone",
        "collections/ParasitemeiaCollection",
        "text!templates/strainrow.html"],

    function($, Backbone,
            ParasitemeiaCollection,
            template){

        var StrainRowView = Backbone.View.extend({

            // The DOM Element associated with this view
            tagName: "li",

            // View constructor
            initialize: function() {

                // found that event handlers would persist between views
                this._destroyEvents();

                this.model.on("change", this.quickRender, this);

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

                var dateCreated = new moment(this.model.get("DateCreated"));

                var viewModel = {
                    Name: this.model.get("Name"),
                    DateCreated: dateCreated,
                    Stage: this.getStage(dateCreated)
                };       

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template(viewModel));

                // Maintains chainability
                return this;
            },

            quickRender: function() {
                var dateCreated = new moment(this.model.get("DateCreated"));

                this.$el.find(".lblStage").text(this.getStage(dateCreated));
                $(".slide-sync").css("opacity", "0").css("z-index", "-1");
                $(".slide-delete").css("opacity", "0").css("z-index", "-1");
            },

            getStage: function(dateCreated) {      
                var now = new moment();
                var dateCreatedMidnight = new moment([dateCreated.year(), dateCreated.month(), dateCreated.day()]);

                var daysDiff = dateCreatedMidnight.diff([now.year(), now.month(), now.day()], 'days');
                var stage = (daysDiff % 2 === 0) ? "R" : "T";

                var stageOverride = this.model.get("StageOverride"); 
                if (stageOverride) {
                    if (stage === "R")
                        stage = "T";
                    else
                        stage = "R";
                }
                return stage;
            },

            // View Event Handlers
            events: {
                "tap": "showStrainCounters",
                "swiperight": "showRowDelete",
                "swipeleft": "showRowSync",
                "tap .btnDelete": "deleteStrain",
                "tap .btnSync": "syncStrain" 
            },

            showStrainCounters: function(e) {
                e.stopPropagation();
                e.preventDefault();

                if (!$(e.target).hasClass("btnDelete") && !$(e.target).hasClass("btnSync"))
                    mobileApp.navigate("strain?=" + this.model.id, {trigger: true});
            },

            showRowDelete: function(e) {
                e.stopPropagation();
                e.preventDefault();
                $(".slide-sync").css("opacity", "0").css("z-index", "-1");
                $(".slide-delete").css("opacity", "0").css("z-index", "-1");
                this.$(".slide-delete").css("opacity", ".999").css("z-index", "100");
            },

            showRowSync: function(e) {
                e.stopPropagation();
                e.preventDefault();
                //find current shown one and remove and not all...
                $(".slide-delete").css("opacity", "0").css("z-index", "-1");
                $(".slide-sync").css("opacity", "0").css("z-index", "-1");
                this.$(".slide-sync").css("opacity", ".999").css("z-index", "100");
            },

            deleteStrain: function(e) {
                e.stopPropagation();
                e.preventDefault();               
                
                var view = this;
                var strainName = this.model.get("Name");
                this.model.destroy({
                    success: function() {

                        var paraCollection = new ParasitemeiaCollection();
                        paraCollection.fetch({
                            success: function() {

                                var filterByStrain = paraCollection.where({ 
                                    Name: strainName 
                                });

                                var length = filterByStrain.length; 
                                for (var i = length - 1; i >= 0; i--) { 
                                    filterByStrain[i].destroy();
                                }
                            }
                        });

                        //could re-render collection but would lose scroll position so removing view                 
                        view.remove();
                        $('#list').listview('refresh');
                    }
                });      
            },

            syncStrain: function(e) {
                e.stopPropagation();
                e.preventDefault();
                this.model.save({
                    "StageOverride": (this.model.get("StageOverride")) ? false : true
                });
            },

            _destroyEvents: function() {
                this.undelegateEvents();
                this.$el.removeData().off(); 
            },

            _iscrollRefresh: function() {
                setTimeout(function () {
                    window.iScroller.refresh();
                }, 0);
            }

        });

        // Returns the View module
        return StrainRowView;
    }
);
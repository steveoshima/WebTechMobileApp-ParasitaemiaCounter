// FooterView.js
// -------
define(["jquery", "backbone"],

    function($, Backbone){

        var FooterView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "footer",

            // View constructor
            initialize: function() {

                // found that event handlers would persist between views
                this._destroyEvents();

            },

            setCalcViewBtnActive: function() {
                var $btnCalcView = $("#btnCalcView");
                var $footerBtns = this.$el.find("a");
                $footerBtns.removeClass("ui-btn-active");
                $btnCalcView.addClass("ui-btn-active");
            },

            // View Event Handlers
            events: {
                //"tap #btnCalcView": "switchCalcView",
                //"tap #btnHistoryView": "navtoHistoryView",
                "click #btnStrainsView": "navtoStrainView",
                "click #btnInfoView": "navtoInfoView"
            },

            navtoStrainView: function(e) {
                e.preventDefault();
                mobileApp.navigate("strains", {trigger: true});
            },

            navtoInfoView: function(e) {
                e.preventDefault();
                mobileApp.navigate("info", {trigger: true});
            },

            navtoHistoryView: function(e) {
                e.preventDefault();
                mobileApp.navigate("history", {trigger: true});
            },

            // NOT USED NOW
            switchCalcView: function(e) {
                e.stopImmediatePropagation();

                var $btnCalcView = $("#btnCalcView");
                var $btnCalcViewText = $("#btnCalcView .ui-btn-text");

                var isCalcViewActive = (Backbone.history.fragment === "strains") ? false : true;
                var isCounter1ViewActive = $btnCalcView.hasClass("counter1");

                if (isCalcViewActive) {

                    switch(isCounter1ViewActive) {                      
                        case true:
                            mobileApp.navigate("calc2button", {trigger: true});
                            //$btnCalcView.attr("href","#calc2button");
                            $btnCalcView.removeClass("counter1");
                            $btnCalcView.addClass("counter2");
                            $btnCalcViewText.text("Counter 2");
                         break;
                        case false:
                            mobileApp.navigate("calc3button", {trigger: true});
                            //$btnCalcView.attr("href","#calc3button")
                            $btnCalcView.removeClass("counter2");
                            $btnCalcView.addClass("counter1");
                            $btnCalcViewText.text("Counter 1");
                         break;
                     }
                }
                else {
                    switch(isCounter1ViewActive) {                      
                        case true:
                            mobileApp.navigate("calc3button", {trigger: true});
                         break;
                        case false:
                            mobileApp.navigate("calc2button", {trigger: true});
                         break;
                     }
                     //this.setCalcViewBtnActive();
                }
            },

            _destroyEvents: function() {
                this.undelegateEvents();
                this.$el.removeData().off(); 
            }

        });

        // Returns the View class
        return FooterView;

    }

);
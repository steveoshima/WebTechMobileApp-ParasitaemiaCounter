// MobileRouter.js
// ---------------
define(["jquery", "backbone", 
        "views/HeaderView", "views/FooterView",
        "views/Calc3ButtonView", "views/Calc2ButtonView", "views/CounterListView", "views/CounterView",
        "views/StrainListView", "views/InfoView",
        "models/ParasitameiaModel", "collections/ParasitemeiaCollection", "models/StrainModel", "collections/StrainCollection"],
        
    function($, Backbone, 
            HeaderView, FooterView,
            Calc3ButtonView, Calc2ButtonView, CounterListView, CounterView,
            StrainListView, InfoView,
            ParasitameiaModel, ParasitemeiaCollection, StrainModel, StrainCollection) {

        var MobileRouter = Backbone.Router.extend({

            initialize: function() {
                // Tells Backbone to start watching for hashchange events
                Backbone.history.start({pushState: false});
            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash bang on the url, the home method is called
                "": "strains",
                "strains": "strains",
                "strain?=:strainId": "strain",
                "calc3button?=:strainId": "calc3button",
                "calc2button?=:strainId": "calc2button",
                "history": "history",
                "historyitem?=:paraId&strainId=:strainId": "historyitem", // odd issue where "strain/:id" doesnt work?!
                "info": "info"
            },

            strains: function() {

                var strainCollection = new StrainCollection();

                var strainListView = new StrainListView({
                    collection: strainCollection
                });

                new HeaderView({
                    title: "Strains",
                    left: null,
                    right: { 
                        name: "Add", 
                        navevent: function(e) { 
                            strainListView.popAdd.call(strainListView, e)
                        },
                        navextra: 'data-icon="plus"'
                    },
                });
                new FooterView();

                var footerHeight = $('[data-role="footer"]').outerHeight(true),
                    headerHeight = $('[data-role="header"]').outerHeight(true);
    
                $('#scroller').height( $(window).innerHeight() - headerHeight - footerHeight );
   
                window.iScroller = new iScroll('scroller', { hScrollbar: false, vScrollbar: false, hScroll: false } );
            },

            strain: function(strainId) {

                var strainCollection = new StrainCollection();
                var paraCollection = new ParasitemeiaCollection();
                var paraCollectionFiltered = new ParasitemeiaCollection();
                var counterListView;

                //tidy up
                strainCollection.fetch({
                    success: function() {
                        counterListView = new CounterListView({
                            model: strainCollection.get(strainId),
                            collection: paraCollectionFiltered,
                        });

                        paraCollection.fetch({
                            success: function() {
                                paraCollectionFiltered.reset(paraCollection.where({ 
                                    Name: strainCollection.get(strainId).get("Name") 
                                }));
                            }
                        });
                    }
                });

                new HeaderView({
                    title: strainCollection.get(strainId).get("Name"),
                    left: {
                        name: "Back",
                        navevent: function(e) {
                            e.preventDefault();
                            mobileApp.navigate("strains", {trigger: true})
                        },
                        navextra: 'data-icon="arrow-l"'
                    },
                    right: { 
                        name: "Add", 
                        navevent: function(e) { 
                            counterListView.popCounterChoice.call(counterListView, e) 
                        },
                        navextra: 'data-icon="plus"'
                    }
                });
                new FooterView();
            },

            calc3button: function(strainId) {

                var paraModel;
                var strainCollection = new StrainCollection();
                strainCollection.fetch({
                    success: function() {
                        paraModel = new ParasitameiaModel({ Name: strainCollection.get(strainId).get("Name") });
                    }
                });
                var paraCollection = new ParasitemeiaCollection();

                var calc3ButtonView = new Calc3ButtonView({
                    model: paraModel,
                    collection: paraCollection,
                    strainId: strainId
                });

                new HeaderView({
                    title: "Parasitamia",
                    left: { 
                        name: "Clear", 
                        navevent: function(e) {
                            calc3ButtonView.reset.call(calc3ButtonView, e);
                        }
                    },
                    right: { 
                        name: "Save", 
                        navevent: function(e) { 
                            calc3ButtonView.popSave.call(calc3ButtonView, e);
                        },
                        navextra: 'data-icon="plus"'
                    }
                });
                new FooterView();
            },

            calc2button: function(strainId) {

                var paraModel;
                var strainCollection = new StrainCollection();
                strainCollection.fetch({
                    success: function() {
                        paraModel = new ParasitameiaModel({ 
                            Name: strainCollection.get(strainId).get("Name") });
                    }
                });
                var paraCollection = new ParasitemeiaCollection();

                var calc2ButtonView = new Calc2ButtonView({
                    model: paraModel,
                    collection: paraCollection,
                    strainId: strainId
                });

                new HeaderView({
                    title: "Parasitamia",
                    left: { 
                        name: "Clear", 
                        navevent: function(e) {
                            calc2ButtonView.reset.call(calc2ButtonView, e);
                        }
                    },
                    right: { 
                        name: "Save", 
                        navevent: function(e) { 
                            calc2ButtonView.popSave.call(calc2ButtonView, e);
                        },
                        navextra: 'data-icon="plus"'
                    }
                });
                new FooterView();
            },

            history: function() {

                var paraCollection = new ParasitemeiaCollection();

                var counterListView = new CounterListView({
                    collection: paraCollection
                });

                paraCollection.fetch();

                new HeaderView({
                    title: "Counter History",
                    left: null,
                    right: null
                });
                new FooterView();
            },

            historyitem: function(paraId, strainId) {

                var paraCollection = new ParasitemeiaCollection();

                paraCollection.fetch({
                    success: function() {
                        var counterView = new CounterView({
                            model: paraCollection.get(paraId)
                        }); 
                    }
                });

                new HeaderView({
                    title: "Count",
                    left: { 
                        name: "Back",
                        navevent: function(e) {
                            e.preventDefault();
                            var backNav = (strainId) ? "strain?=" + strainId : "history";
                            mobileApp.navigate(backNav,  {trigger: true})
                        },
                        navextra: 'data-icon="arrow-l"'
                    },
                    right: null
                });
                new FooterView();
            },

            info: function() {

                var strainCollection = new StrainCollection();
                var paraCollection = new ParasitemeiaCollection();

                var infoView = new InfoView({
                    strainCollection: strainCollection,
                    paraCollection: paraCollection
                });

                new HeaderView({
                    title: "About",
                    left: { 
                        name: "Reset", 
                        navevent: function(e) { 
                            infoView.popReset.call(infoView, e);
                        } 
                    },
                    right: null
                });
                new FooterView();
            }

            
        });

        // Returns the MobileRouter class
        return MobileRouter;
    }

);
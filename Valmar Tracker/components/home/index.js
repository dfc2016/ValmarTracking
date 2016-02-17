'use strict';

app.home = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function (parent) {
    var dataProvider = app.data.valmarTracker;
    var homeModel = kendo.observable({
        fields: {
            username: '',
        },
        empezar: function () {            
            //User has registered his nick name
            app.mobileApp.navigate('#components/home/listTrackers.html');
        },
        cancel: function () {}
    });    
    parent.set('homeModel', homeModel);
    
    var listTrackersViewModel = kendo.observable({
        onShow: function(e){
            console.log("listTrackersViewModel >>> onShow");
        },
        onAfterShow: function(e){
            console.log("listTrackersViewModel >>> onAfterShow");
        }
    });
    parent.set('listTrackersViewModel', listTrackersViewModel);
})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel
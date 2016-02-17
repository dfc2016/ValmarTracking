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
            selectedRol: "Vendedor",
            username: "",
            isInvisible: false,
        },
        
        empezar: function () {
            console.log(" username >>> " + homeModel.fields.username);
            console.log(" selectedRol >>> " + homeModel.fields.selectedRol);

            switch (homeModel.fields.username) {
                case "Marcos":
                case "Carlos":
                case "Juan":
                    console.log(" username >>> OK " + homeModel.fields.username);
                    switch (homeModel.fields.selectedRol) {
                        case "Vendedor":
                            console.log(" Rol >>> Vendedor ");
                            app.mobileApp.navigate('#components/home/inicioVendedor.html');
                            break;
                        case "Supervisor":
                            console.log(" Rol >>> Supervisor ");
                            app.mobileApp.navigate('#components/home/inicioSupervisor.html');
                            break;
                        default:
                            console.log(" Rol >>> **KO** no valido");
                    }
                    break;
                default:
                    console.log(" username >>> **KO** " + homeModel.fields.username);
                    //var notificationElement = $("#notification");
                    // notificationElement.kendoNotification();
                    // var notificationWidget = notificationElement.data("kendoNotification");
                    // notificationWidget.show("Usuario: no registrado", "error");
                    // $("#notification").html("Usuario no registrado");
                    this.set("isInvisible", false);
            }
        },
    });
    parent.set('homeModel', homeModel);

    var listTrackersViewModel = kendo.observable({
        onShow: function (e) {
            console.log("listTrackersViewModel >>> onShow");
        },
        onAfterShow: function (e) {
            console.log("listTrackersViewModel >>> onAfterShow");
        }
    });
    parent.set('listTrackersViewModel', listTrackersViewModel);
})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel
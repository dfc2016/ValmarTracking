'use strict';

app.home = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
    onShowIniSuperVisor: function () {
        console.log(" onShowIniSuperVisor >>> OK");
        console.log(" LoggedUser >>> "+loggedUser);
        $("#userSuperVisor").html(loggedUser);
    },
    afterShowIniSuperVisor: function () {
        console.log(" afterShowIniSuperVisor >>> OK");
    },    
    afterShowUltimasPosiciones: function () {
        console.log(" afterShowUltimasPosiciones >>> OK");
        $("#mapUltimasPosiciones").kendoMap({
            center: [-12.1061, -77.0371],
            zoom: 12,
            layers: [
                {
                    type: "tile",
                    urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
                    subdomains: ["a", "b", "c"],
                },
                {
                    //Layer for position of location's device
                    type: "marker",
                    dataSource: dsTarget,
                    locationField: "latlng",
                    titleField: "name",
                    shape: "pin",
                },
            ],
        });
        var dsTarget = new kendo.data.DataSource({
            data: [
                {
                    latlng: [-12.1061, -77.0371],
                    name: "Vendedor:<b>Marcos</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>15:20:07</b>"
                },
                {
                    latlng: [-12.1010, -77.0599],
                    name: "Vendedor:<b>Carlos</b><br>Fecha:<b>10-02-2016</b><br>Hora:<b>10:04:00</b>"
                },
                {
                    latlng: [-12.0710, -77.0799],
                    name: "Vendedor:<b>Juan</b><br>Fecha:<b>10-02-2016</b><br>Hora:<b>10:04:00</b>"
                },
            ]
        });
        var map = $("#mapUltimasPosiciones").data("kendoMap");
        var layerTarget = map.layers[1];
        layerTarget.setDataSource(dsTarget);
    },
    onShowInicioVendedor: function () {
       $("#userVendedor").html(loggedUser); 
    },
    onShowViewPosVendedor: function () {
       $("#vendedorPosicion").html(loggedUser); 
    },
    afterShowViewPosVendedor: function () {
        console.log(" afterShowViewPosVendedor >>> OK");
        $("#mapPosVendedor").kendoMap({
            center: [-12.1061, -77.0371],
            zoom: 12,
            layers: [
                {
                    type: "tile",
                    urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
                    subdomains: ["a", "b", "c"],
                },
            ],
        });

    },
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
            isVisible: false,
        },

        empezar: function () {
            // console.log(" username >>> " + homeModel.fields.username);
            // console.log(" selectedRol >>> " + homeModel.fields.selectedRol);

            switch (homeModel.fields.username) {
                case "Marcos":
                case "Carlos":
                case "Juan":
                    // console.log(" username >>> OK " + homeModel.fields.username);
                    loggedUser = homeModel.fields.username;
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
                    this.set("homeModel.fields.isVisible", false);
                    break;
                default:
                    console.log(" username >>> **KO** " + homeModel.fields.username);
                    this.set("homeModel.fields.isVisible", true);
                    $("#UsrNoRegistrado").html("Usuario " + homeModel.fields.username + " no registrado");
            }
        },

        limpiar: function () {
        	this.set("homeModel.fields.isVisible", false);
        	this.set("homeModel.fields.username", "");
            this.set("homeModel.fields.selectedRol", "Vendedor");
        },
    });
    parent.set('homeModel', homeModel);
    
    var inicioSupervisorModel = kendo.observable({
        fields: {
            loggedUser: loggedUser,
        },
        
        ultimaPosColaboradores: function (e) {
            console.log("click >>> ultimaPosColaboradores");
            app.mobileApp.navigate('#components/home/viewUltimasPosiciones.html');
        },
        
        terminar: function (e) {
            console.log("inicioSupervisorModel >>> click >>> terminar");
            app.mobileApp.navigate('#components/home/view.html');
        },
        
    });
    parent.set('inicioSupervisorModel', inicioSupervisorModel);
    
    var viewUltimasPosiciones = kendo.observable({
        inicioSuperVisor: function (e) {
            console.log("viewUltimasPosiciones >>> click >>> terminar");
            app.mobileApp.navigate('#components/home/inicioSupervisor.html');
        },
        terminar: function (e) {
            console.log("viewUltimasPosiciones >>> click >>> terminar");
            app.mobileApp.navigate('#components/home/view.html');
        },        
    });
    parent.set('viewUltimasPosiciones', viewUltimasPosiciones);
    
    var inicioVendedorModel = kendo.observable({
        nuevaPosVendedor: function (e) {
            app.mobileApp.navigate('#components/home/viewPosVendedor.html');
        },
        terminar: function (e) {
            app.mobileApp.navigate('#components/home/view.html');
        },
    });
    parent.set('inicioVendedorModel', inicioVendedorModel);
    
    var viewPosVendedor = kendo.observable({
        inicioVendedor: function (e) {
            app.mobileApp.navigate('#components/home/inicioVendedor.html');
        },
        terminar: function (e) {
            app.mobileApp.navigate('#components/home/view.html');
        },        
    });
    parent.set('viewPosVendedor', viewPosVendedor);

})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
var loggedUser = "";
// END_CUSTOM_CODE_homeModel
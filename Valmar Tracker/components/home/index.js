'use strict';

app.home = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
    onShowIniSuperVisor: function () {
        console.log(" onShowIniSuperVisor >>> OK");
        console.log(" LoggedUser >>> " + loggedUser);
        $("#userSuperVisor").html(loggedUser);
    },
    afterShowIniSuperVisor: function () {
        console.log(" afterShowIniSuperVisor >>> OK");
        // 20160224 TEST Expand Expression Data BS
        // var expandExp = {
        //     "Positions": {
        //         "Positions.Tracker": true
        //     }
        // };

        var expandExp = {
            "Locations": {
                "TargetTypeName": "Positions"
            }
        };
        var queryBS = new Everlive.Query();
        queryBS.expand(expandExp);
        queryBS.where().eq("Username", loggedUser);
        TrackersBS.get(queryBS).then(
            function (data) {
                console.log("Query BS Expanded SUCCES user >>> " + loggedUser);
                // console.log(JSON.stringify(data));
                console.log("Expanded data POS 1 >>> "+JSON.stringify(data.result[0].Locations[0].Pos));
                console.log("Expanded data POS 2 >>> "+JSON.stringify(data.result[0].Locations[1].Pos));
            },
            function (error) {
                console.log("Query BS Expanded ERROR user >>> " + loggedUser);
                console.log(JSON.stringify(error));
            }
        );
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
    beforeShowInicioVendedor: function () {
        dsVendedores.filter({
            field: "name",
            operator: "neq",
            value: loggedUser
        });
        console.log("beforeShowInicioVendedor >>> OK");
    },
    onShowInicioVendedor: function () {
        $("#userVendedor").html(loggedUser);
    },
    afterShowInicioVendedor: function () {
        console.log("afterShowInicioVendedor >>> OK");
    },
    onShowViewPosVendedor: function () {
        $("#vendedorPosicion").html(loggedUser);
    },
    afterShowViewPosVendedor: function () {
        console.log(" afterShowViewPosVendedor >>> OK");
        navigator.geolocation.getCurrentPosition(
            onSuccessPosVendedor,
            onErrorPosVendedor,
            // DFC 20160208 ALWAYS __TURN_ON__ GPS FX ON MOBILE DEVICE or LOCATION FX ON PC IF EXISTS 
            // IF PC DOESN'T EXIXST LOCATION FX, THE CHROME SIMULATOR DOESN'T CAPTURE POS (LAT,LNG) 
            // SO COMMENT OUT THE OPTIONS OF navigator.geolocation.watchPosition(...) BELOW
            {
                maximumAge: 3000,
                timeout: 5000,
                enableHighAccuracy: true
            }
        );

        function onSuccessPosVendedor(position) {

            var strLabelPosVendedor = "";
            strLabelPosVendedor = "<b>";
            strLabelPosVendedor = strLabelPosVendedor + loggedUser;
            strLabelPosVendedor = strLabelPosVendedor + "</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>15:20:07</b>";

            var dsPosVendedor = new kendo.data.DataSource({
                data: [
                    {
                        latlng: [position.coords.latitude, position.coords.longitude],
                        name: strLabelPosVendedor
                    },
                ]
            });

            var dsPosRecientesVendedor = null;

            switch (loggedUser) {
                case "Marcos":
                    dsPosRecientesVendedor = dsPosRecientesMarcos;
                    break;
                case "Carlos":
                    dsPosRecientesVendedor = dsPosRecientesCarlos;
                    break;
                case "Juan":
                    dsPosRecientesVendedor = dsPosRecientesJuan;
                    break;
                default:
            }


            $("#mapPosVendedor").kendoMap({
                center: [position.coords.latitude - 0.005, position.coords.longitude],
                zoom: 11,
                layers: [
                    {
                        type: "tile",
                        urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
                        subdomains: ["a", "b", "c"],
                    },
                    {
                        //Layer for current position of Vendedor
                        type: "marker",
                        dataSource: dsPosVendedor,
                        locationField: "latlng",
                        titleField: "name",
                        shape: "pinTarget",
                    },
                    {
                        //Layer for current position of Vendedor
                        type: "marker",
                        dataSource: dsPosRecientesVendedor,
                        locationField: "latlng",
                        titleField: "name",
                        shape: "pin",
                    },
                ],
            });
        }

        function onErrorPosVendedor(error) {
            console.log("onErrorPosVendedor >>> " + error.code);
        }

    },
    beforeShowViewPosVendedor: function () {
        msgWaitPosVendedor();
    },
    onHideViewPosVendedor: function () {
        msgWaitPosVendedor();
    },
    onShowRegUsuario: function () {
        console.log(" onShowRegUsuario >>> OK");
        console.log(" New User >>> " + newUser);
        $("#nuevoUsuario").html(newUser);
    },
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function (parent) {
    var dataProvider = app.data.valmarTracker;

    var homeModel = kendo.observable({
        fields: {
            // selectedRol: "Vendedor",
            username: "",
            isVisible: false,
        },

        empezar: function () {
            // console.log(" username >>> " + homeModel.fields.username);
            // console.log(" selectedRol >>> " + homeModel.fields.selectedRol);
            // Clean up starting and ending white spaces
            this.set(
                'homeModel.fields.username',
                homeModel.fields.username.trim()
            );

            // 20160224 Add here code for validating tracker users against Everlive Back End Service START
            var queryBS = new Everlive.Query();
            queryBS.where().eq("Username", homeModel.fields.username);
            // console.log("TrackersBS.get >>> START");
            TrackersBS.get(queryBS).then(
                function (data) {
                    // alert(JSON.stringify(data));
                    // console.log(JSON.stringify(data));
                    if (data.count == 1) {
                        // console.log("*** OK USUARIO REGISTRADO ***");
                        // console.log("Username >>> "+data.result[0].Username);
                        // console.log("Role >>> "+data.result[0].Role);
                        loggedUser = homeModel.fields.username;
                        if ((data.result[0].Role) == "V") {
                            // ROL VENDEDOR
                            // console.log("BS >>> Rol >>> Vendedor");
                            app.mobileApp.navigate('#components/home/inicioVendedor.html');
                        }
                        if ((data.result[0].Role) == "S") {
                            // ROL SUPERVISOR
                            // console.log("BS >>> Rol >>> Supervisor");
                            app.mobileApp.navigate('#components/home/inicioSupervisor.html');
                        }
                    }
                    if (data.count == 0) {
                        // console.log("** KO BS** USUARIO NO REGISTRADO >>> "+homeModel.fields.username);
                        parent.set("homeModel.fields.isVisible", true);
                        $("#UsrNoRegistrado").html("Estimado " + homeModel.fields.username + " no estas registrado");
                        newUser = homeModel.fields.username;
                    }
                },
                function (error) {
                    // alert(JSON.stringify(error));
                    console.log(JSON.stringify(error));
                }
            );
            // THIS FRAGMENT OF CODE RUN ASINCROUSLY, ** BEFORE ** THS SUCCESS FUNCTION OF TrackersBS OBJECT
            // console.log("TrackersBS.get >>> STOP");
            queryBS = null;
            // 20160224 Add here code for validating tracker users against Everlive Back End Service END

            // switch (homeModel.fields.username) {
            //     case "Marcos":
            //     case "Carlos":
            //     case "Juan":
            //         // console.log(" username >>> OK " + homeModel.fields.username);
            //         loggedUser = homeModel.fields.username;
            //         switch (homeModel.fields.selectedRol) {
            //             case "Vendedor":
            //                 console.log(" Rol >>> Vendedor ");
            //                 app.mobileApp.navigate('#components/home/inicioVendedor.html');
            //                 break;
            //             case "Supervisor":
            //                 console.log(" Rol >>> Supervisor ");
            //                 app.mobileApp.navigate('#components/home/inicioSupervisor.html');
            //                 break;
            //             default:
            //                 console.log(" Rol >>> **KO** no valido");
            //         }
            //         this.set("homeModel.fields.isVisible", false);
            //         break;
            //     default:
            //         console.log(" username >>> **KO** " + homeModel.fields.username);
            //         this.set("homeModel.fields.isVisible", true);
            //         $("#UsrNoRegistrado").html("Usuario " + homeModel.fields.username + " no registrado");
            // }
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

    var registraUsuarioModel = kendo.observable({
        fields: {
            selectedRol: "Vendedor",
            msgRegNuevoUsuario: "",
        },
        registraUsuario: function (e) {
            app.mobileApp.navigate('#components/home/registraUsuario.html');
        },
        terminar: function (e) {
            app.mobileApp.navigate('#components/home/view.html');
            parent.set("homeModel.fields.isVisible", false);
        },
        creaNuevoUsuario: function (e) {
            this.set("registraUsuarioModel.fields.msgRegNuevoUsuario", "Registrando nuevo usuario...");
            var rolNuevoUsuario = "";
            if (registraUsuarioModel.fields.selectedRol == "Supervisor") {
                // console.log(" >>> CREAR NUEVO ** SUPERVISOR **");
                rolNuevoUsuario = "S";
            }
            if (registraUsuarioModel.fields.selectedRol == "Vendedor") {
                // console.log(" >>> CREAR NUEVO ** VENDEDOR **");
                rolNuevoUsuario = "V";
            }
            // console.log("Nuevo USR >>> "+newUser);

            TrackersBS.create({
                    "Username": newUser,
                    "Role": rolNuevoUsuario
                },
                function (data) {
                    // console.log("Nuevo USR creato >>> "+JSON.stringify(data));                    
                    parent.set("registraUsuarioModel.fields.msgRegNuevoUsuario", "REGISTRO NUEVO USUARIO OK!!");
                },
                function (error) {
                    // console.log("Nuevo USR error >>> "+JSON.stringify(error));
                    parent.set("registraUsuarioModel.fields.msgRegNuevoUsuario", "ERROR REGISTRANDO USUARIO KO!!!!");
                }
            );
        },
    });
    parent.set('registraUsuarioModel', registraUsuarioModel);

})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
var loggedUser = "";
var newUser = "";

var dsPosRecientesCarlos = new kendo.data.DataSource({
    data: [
        {
            latlng: [-12.0767, -77.0210],
            name: "Pos:<b>1</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>15:20:07</b>"
        },
        {
            latlng: [-12.0952, -76.9985],
            name: "Pos:<b>2</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>15:20:07</b>"
        },
        {
            latlng: [-11.9947, -77.0546],
            name: "Pos:<b>3</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>15:20:07</b>"
        },
    ]
});

var dsPosRecientesMarcos = new kendo.data.DataSource({
    data: [
        {
            latlng: [-12.0704, -77.0934],
            name: "Pos:<b>1</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>09:20:07</b>"
        },
        {
            latlng: [-12.0225, -77.1085],
            name: "Pos:<b>2</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>10:34:02</b>"
        },
        {
            latlng: [-11.9740, -77.0880],
            name: "Pos:<b>3</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>12:20:37</b>"
        },
        {
            latlng: [-12.0915, -77.0209],
            name: "Pos:<b>4</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>15:20:07</b>"
        },
    ]
});

var dsPosRecientesJuan = new kendo.data.DataSource({
    data: [
        {
            latlng: [-12.0753, -76.9116],
            name: "Pos:<b>1</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>09:20:07</b>"
        },
        {
            latlng: [-12.1190, -77.0285],
            name: "Pos:<b>2</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>11:25:15</b>"
        },
        {
            latlng: [-12.1849, -77.0279],
            name: "Pos:<b>3</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>15:27:00</b>"
        },
        {
            latlng: [-12.0698, -77.0426],
            name: "Pos:<b>4</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>16:40:31</b>"
        },
        {
            latlng: [-12.0833, -77.0542],
            name: "Pos:<b>5</b><br>Fecha:<b>03-02-2016</b><br>Hora:<b>17:20:07</b>"
        },

    ]
});

function msgWaitPosVendedor() {
    var strHTML = "<div class=\"container-fluid\">";

    strHTML += "<div class=\"row\">";
    strHTML += "<div class=\"col-xs-12\">";
    strHTML += "<h3>";
    strHTML += "Por favor espsera un momento estamos ubicando tu posicion...";
    strHTML += "</h3>";
    strHTML += "</div>";
    strHTML += "</div>";

    strHTML += "</div>";

    $("#mapPosVendedor").html(strHTML);
}

// 20160224 Objects Everlive Back End Service START
var providerBS = app.data.valmarTracker;
var TrackersBS = providerBS.data("Trackers");
// 20160224 Objects Everlive Back End Service START

// END_CUSTOM_CODE_homeModel
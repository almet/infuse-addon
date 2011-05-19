const {Cc, Ci} = require("chrome");
const self = require("self");

exports.getPosition = getPosition; 

/**
 * Return the geolocation object
 **/
function getGeolocation(){
    return Cc["@mozilla.org/geolocation;1"]
        .getService(Ci.nsIDOMGeoGeolocation);
}

/**
 * Get the longitude and latitude, using the geolocation object.
 *
 * It asks for authorisation before processing to keep users privacy.
 *
 * @param callback the function to call with the geolocation information
 **/
function getPosition(callback){
    var geo = getGeolocation();
    geo.getCurrentPosition(callback);
}

/**
 * Ask for permission to access the geolocation APIs for this addon
 *
 * The message will be prompted and a callback function will be called as soon 
 * as the authorisation is allowed.
 **/
function askPermission(message, callback){
    // get the window
    var pref = "extensions." + self.id + ".allowGeolocation";
    var window = Cc["@mozilla.org/appshell/window-mediator;1"].
        getService(Ci.nsIWindowMediator).
        getMostRecentWindow("navigator:browser");

    let branch = Cc["@mozilla.org/preferences-service;1"]
               .getService(Ci.nsIPrefBranch2);
  
    if (branch.getPrefType(pref) === branch.PREF_STRING) {
        switch (branch.getCharPref(pref)) {
            case "always":
                return callback(true);
            case "never":
                return callback(false);
        }
    }

    let done = false;
    function remember(value, result) {
        return function () {
            done = true;
            branch.setCharPref(pref, value);
            callback(result);
        }
    }
    
    let notification = window.PopupNotifications.show(window.gBrowser.selectedBrowser, 
            "geolocation", message, "geo-notification-icon",
            {
                label: "Share Location",
                accessKey: "S",
                callback: function (notification) {
                    done = true;
                    callback(true);
                }
            }, 
            [
                {
                    label: "Always Share",
                    accessKey: "A",
                    callback: remember("always", true)
                },
                {
                    label: "Never Share",
                    accessKey: "N",
                    callback: remember("never", false)
                }
            ], 
            {
                eventCallback: function (event) {
                    if (event === "dismissed") {
                        if (!done)
                          callback(false);
                        done = true;
                        window.PopupNotifications.remove(notification);
                    }
                },
                persistWhileVisible: true
            });
    }

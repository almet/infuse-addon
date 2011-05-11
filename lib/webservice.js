// imports
const request = require("request");
const pw = require("passwords");
const {Cc, Ci} = require("chrome");

const main = require("main");
const user = require("user");

// constants
const WS_URL = "http://localhost:5000/";

/** 
 * Retrieve the name of the user from the storage.
 * TODO move away from this module ?
 *
 * @return String the username of the active user.
 **/

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            return {
                'lat': position.coords.latitude,
                'long': position.coords.longitude
            }
        });
    } else {
        return {}
    }
}

/**
 * Send a POST request to the web service with the information related to the
 * user browsing.
 *
 * This function handles the login to the web service.
 *
 * @param type: the type of action that have been recorded (can be "ready",
 * "activate", "deactivate" or "close")
 * @param tab: the tab object
 * @return none
 **/
function postEvent(type, tab){
        // build the content
        // don't post about:blank links
        if (tab.url == "about:blank"){
            return
        }
        var req = request.Request({
            url: WS_URL + "event/",
            content: {
                type: type,
                url: tab.url,
                title: tab.title,
                tab_id: tab.id,
                timestamp: Date.parse(new Date())
            },
            onComplete: function(response){
              // TODO check if everything went well
            }
        });
        console.log("tab " + tab.id + " is now "+ type + 
                " (resource " + tab.url + ")");
        post(req);
}

/**
 * Send information about tab relations to the browser
 **/
function postRelation(currentTab, parentTab){
    var req = request.Request({
        url: WS_URL + "tab-relation/",
        content: {
            'tab_id': currentTab.id,
            'parent_id': parentTab.id
        }
    });
    console.log("tab " + parentTab.id + " is parent of "+ currentTab.id);
    post(req);
}

/**
 * Wrapper arount the actual request.post method to post only if the plugin is
 * active
 **/
function post(req){
    if(main.isActive() == true){
        credentials = user.get(function onComplete(credentials) {
            credentials.forEach(function(c){

                var base64string = base64encode(c.username + ":" + c.password);
                req.headers['Authorization'] = "Basic " + base64string;
                req.post()
            })
        });
    }
}


function base64encode(str) {
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);
    return wm.getMostRecentWindow("navigator:browser").btoa(str);
}

// export the functions
exports.postEvent = postEvent;
exports.postRelation = postRelation;

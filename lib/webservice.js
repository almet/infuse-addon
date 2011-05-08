// imports
const request = require("request");
const main = require("main");

// constants
const WS_URL = "http://localhost:5000/";
const BROWSER = "Work";

/** 
 * Retrieve the name of the user from the storage.
 * TODO move away from this module ?
 *
 * @return String the username of the active user.
 **/
function getUsername(){
    return "alexis";
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
        var req = request.Request({
            url: WS_URL + "event/",
            content: {
                type: type,
                url: tab.url,
                title: tab.title,
                browser: BROWSER, 
                tab_id: tab.id,
                timestamp: Date.parse(new Date())
            },
            onComplete: function(response){
                            // TODO check if everything have gone well
            }
        });
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
    post(req);
}

/**
 * Wrapper arount the actual request.post method to post only if the plugin is
 * active
 **/
function post(req){
    if(main.isActive() == true){
        req.post()
    }
}

// export the functions
exports.postEvent = postEvent;
exports.postRelation = postRelation;

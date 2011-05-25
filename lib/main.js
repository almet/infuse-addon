// jetpack deps
const widgets = require("widget");
const tabs = require("tabs");
const panels = require("panel");

// app deps
const webservice = require("webservice");
const user = require("user");
const utils = require("utils");
const data = require("self").data;


exports.isActive = isActive; // to be available from outside
exports.toogleActivation = toogleActivation;

var tabRelations = {}

/**
 * Activation utils
 *
 * They have to be defined here to be available system wide.
 **/
var _isActive = true; // by default the plugin is on

function toogleActivation(){
    _isActive = !_isActive;
    if(_isActive){
        menu.contentURL = data.url("img/icon_active.png");
    } else {
        menu.contentURL = data.url("img/icon_inactive.png");
    }
    return _isActive;
}

function isActive(){
    return _isActive;
}

/**
 * Menu widget.
 *
 * The menu widget is available under:
 * - data/menu.js for the interactions with the browser and the different
 *   actions to do when loaded (e.g credentials / activation)
 * - data/menu.html is the actual content of the menu
 **/

var menu = widgets.Widget({
    id: "menu-widget",
    label: "Suggest !",
    contentURL: data.url("img/icon_active.png"), // activated per default
    panel: panels.Panel({
        id:'menu-panel',
        height: 400,
        width: 500,
        contentURL: data.url("menu.html"),
        contentScriptFile: [data.url("jquery-1.6.min.js"),
                            data.url("menu.js")],
        })
});

menu.panel.port.on("toogle-plugin", function(){
    toogleActivation();
});

menu.panel.port.on("update-credentials", function(credentials){
    user.update(credentials["username"], credentials["password"]);
    webservice.checkCredentials(credentials["username"], 
        credentials["password"], function(result){
        menu.panel.port.emit("credentials-checked", result);
    });
});


// FIXME move to events.js ?
/** subscribe to tab events **/

// when loading the addon for the first time, we need to define all the
// identifier for the tabs. This is due to a bug in jetpack-sdk and may be
// removed once it is fixed.
for each(tab in tabs){
    if (tab.id == undefined)
        tab.id = utils.getGUID();
}

// subscribe to tab and windows events
tabs.on('open', function(tab){
    if (tab.id == undefined)
        tab.id = utils.getGUID();

    if (tabs.activeTab != tab){
        // store the relation somewhere
        tabRelations[tab] = tabs.activeTab;
    }

    webservice.postEvent("open", tab);
});

// Subscription to the ready event
tabs.on('ready', function(tab){
    // look into the dict if there is an entry with this tab
    if (tab in tabRelations){
        // if that's a blank tab, we don't care about its parent
        if (tab.url != "about:blank"){
            webservice.postRelation(tab, tabRelations[tab]);
        }
        // remove this couple from the relation anyway
        delete tabRelations[tab];

    }
    // A tab can be ready and not active, we only are interested by active
    // and ready tabs.
    if (tabs.activeTab == tab){
        webservice.postEvent("ready", tab);
    }
});

tabs.on('activate', function(tab){
    webservice.postEvent("activate", tab);
});

tabs.on('deactivate', function(tab){
    webservice.postEvent("deactivate", tab);
});

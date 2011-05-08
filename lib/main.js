// jetpack deps
const widgets = require("widget");
const tabs = require("tabs");
const panels = require("panel");

// app deps
const webservice = require("webservice");
const utils = require("utils");
const data = require("self").data;

// exports
exports.isActive = isActive;


/** The activation utils **/
var _isActive = true; // by default the plugin is on

function toogleActivation(){
    _isActive = !_isActive;
    return _isActive;
}

function isActive(){
    return _isActive;
}

/** the widget **/

var widget = widgets.Widget({
  id: "main-widget",
  label: "Suggest !",
  contentURL: data.url("img/icon_active.png"),
  panel: panels.Panel({
      height: 400, 
      width: 500,
      id:'main-panel',
      contentURL: data.url("options.html")
  }),
});

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
        webservice.postRelation(tab, tabs.activeTab);
    }

    webservice.postEvent("open", tab);
});

// Subscription to the ready
tabs.on('ready', function(tab){
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
    console.log("tab deactivated:" + tab.id);
    webservice.postEvent("deactivate", tab);
});

const pw = require("passwords");
const self = require("self");

exports.update = update;
exports.get = get;

function update(username, password){

    // delete all the credentials ???
    pw.search({
        url: "addon:" + self.uri,
        realm: "webservice",
        onComplete: function onComplete(credentials) {
            credentials.forEach(pw.remove);
            // and store the new one
            pw.store({
                url: "addon:" + self.uri,
                realm: "webservice",
                username: username,
                password: password,
            });
        }
    });
    
}

function get(callback){
    pw.search({ 
        url: "addon:" + self.uri,
        realm: "webservice",
        onComplete: callback
    });
}

var Heroes = require("./Controllers/HeroesController");
var Locations = require("./Controllers/LocationsController");
var Debug = require("./Controllers/DebugController");
var HeroRoute = require("./Controllers/HeroRouteController");
var HeroResponse = require("./Responses/HeroResponse");

var express = require("express");
var app = express();
var server = require("http").Server(app);
console.log("SERVER STARTED");

app.get('/socketio.js', function(req, res) {
    res.sendFile(__dirname + "/socketio.js");
});
app.get('/jquery.js', function(req, res) {
    res.sendFile(__dirname + "/jquery.js");
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
server.listen(3600);
console.log("SERVER LISTENING");

var HeroesInstance = Heroes.create();
Debug.init();
Locations.init();
var HeroResponseInstance = HeroResponse.create();

module.exports = {
    Heroes: HeroesInstance,
    Locations: Locations.getInstance(),
    HeroResponse: HeroResponseInstance,
};

var HeroResponseEmitKey = HeroResponseInstance.getEmitKey();
setInterval(function() {
    var queue = HeroResponseInstance.getQueue();
    for (var i = 0; i < 10; i++) {
        var responseId = queue.shift();
        if (responseId === undefined) {
            break;
        }

        var heroResponse = HeroResponseInstance.getResponse(responseId);
        var hero = HeroesInstance.getHero(HeroResponseInstance.getResponseOwner(responseId));
        for (var key in heroResponse) {
            hero[key] = heroResponse[key];
        }
        hero.getSocket().emit(HeroResponseEmitKey, heroResponse);
    }
}, 100);

// setInterval(function() {
//     var locations =  Locations.getInstance().getLocations();
//     for (var locationId in locations) {
//         var location = locations[locationId];
//         var locationResponses = location.getResponsesReady();
//         var sockets = [];
//         for (var key in locationResponses) {
//             console.log(location.getResponse(key));
//             if (!sockets.length) {
//                 sockets = location.getHeroOnLocationSockets();
//             }
//             location.broadcastResponse(key, sockets);
//         }
//     }
// }, 100);

// setInterval(function() {
//     var memory = process.memoryUsage();
//     var status = "";
//     for (var key in memory) {
//         status += key + "=" + (Math.round((memory[key] / 1024 / 1024) * 100) / 100) + "MB\t";
//     }
//     console.log(status);
// }, 3000);

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket) {
    HeroesInstance.createHero(socket);
    HeroRoute.init(HeroesInstance.getHero(socket.getHeroId()));
    Debug.getInstance().addHeroDebug(socket);
    console.log("HERO " + socket.getHeroId() + " CONNECTED");
});
console.log("SOCKETS LISTENING");

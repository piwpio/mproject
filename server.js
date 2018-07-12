var Heroes = require("./Controllers/HeroesController");
var Locations = require("./Controllers/LocationsController");
var Debug = require("./Controllers/DebugController");
var HeroRoute = require("./Controllers/HeroRouteController");

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

Heroes.init();
Debug.init();
Locations.init();

module.exports = {
    Heroes: Heroes.getInstance(),
    Locations: Locations.getInstance()
};

// console.log(Locations.getInstance().getLocations());
// return;

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket) {
    var HeroesInstance = Heroes.getInstance();
    HeroesInstance.createHero(socket);
    HeroRoute.init(HeroesInstance.getHero(socket.getHeroId()));
    Debug.getInstance().addHeroDebug(socket);
    console.log("HERO " + socket.getHeroId() + " CONNECTED");
});
console.log("SOCKETS LISTENING");

setInterval(function() {
    var heroes =  Heroes.getInstance().getHeroes();
    for (var heroId in heroes) {
        var hero = heroes[heroId];
        var heroResponses = hero.getResponsesReady();
        for (var key in heroResponses) {
            hero.sendResponse(key);
        }
    }
}, 100);

setInterval(function() {
    var locations =  Locations.getInstance().getLocations();
    for (var locationId in locations) {
        var location = locations[locationId];
        var locationResponses = location.getResponsesReady();
        var sockets = [];
        for (var key in locationResponses) {
            console.log(location.getResponse(key));
            if (!sockets.length) {
                sockets = location.getHeroesOnLocationSockets();
            }
            location.broadcastResponse(key, sockets);
        }
    }
}, 100);

// setInterval(function() {
//     var memory = process.memoryUsage();
//     var status = "";
//     for (var key in memory) {
//         status += key + "=" + (Math.round((memory[key] / 1024 / 1024) * 100) / 100) + "MB\t";
//     }
//     console.log(status);
// }, 3000);

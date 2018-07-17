var HEROES = require("./Controllers/HeroesController");
var LOCATIONS = require("./Controllers/LocationsController");
var DEBUG = require("./Controllers/DebugController");
var HEROROUTE = require("./Controllers/HeroRouteController");

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

var HeroesInstance = HEROES.create();
var LocationsInstance = LOCATIONS.create();
DEBUG.init();

module.exports = {
    Heroes: HeroesInstance,
    Locations: LocationsInstance
};

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket) {
    HeroesInstance.createHero(socket);
    HEROROUTE.init(HeroesInstance.getHero(socket.getHeroId()));
    DEBUG.getInstance().addHeroDebug(socket);
    console.log("HERO " + socket.getHeroId() + " CONNECTED");
});
console.log("SOCKETS LISTENING");

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
var heroNewId = 0;
io.sockets.on('connection', function(socket) {
    heroNewId++;
    HeroesInstance.createHero(socket, heroNewId);
    HEROROUTE.init(HeroesInstance.getHero(socket.getHeroId()));
    DEBUG.getInstance().addHeroDebug(socket);
    console.log("HERO " + socket.getHeroId() + " CONNECTED");

    socket.on('disconnect', function() {

    })
});
console.log("SOCKETS LISTENING");

setInterval(function() {
    var memory = process.memoryUsage();
    var status = "";
    for (var key in memory) {
        status += key + "=" + (Math.round((memory[key] / 1024 / 1024) * 100) / 100) + "MB\t";
    }
    console.log(status);
}, 3000);

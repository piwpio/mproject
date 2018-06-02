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

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket) {
    var HeroesInstance = Heroes.getInstance();
    HeroesInstance.initHeroConnect(socket);
    HeroRoute.init(HeroesInstance.getHero(socket.getHeroId()));
    Debug.getInstance().addHeroDebug(socket);
    console.log("HERO " + socket.getHeroId() + " CONNECTED");
});
console.log("SOCKETS LISTENING");

var Heroes = require("./Controllers/HeroesController");
var Locations = require("./Controllers/LocationsController");
var Enemies = require("./Controllers/EnemiesController");
var Debug = require("./Controllers/DebugController");
var HeroRoute = require("./Controllers/HeroRouteController");

var express = require("express");
var app = express();
var server = require("http").Server(app);
console.log("SERVER STARTED");
console.log("SERVER STARTED");

//game
app.get('/js/socketio.js', function(req, res) {
    res.sendFile(__dirname + "/web/js/socketio.js");
});
app.get('/js/jquery.js', function(req, res) {
    res.sendFile(__dirname + "/web/js/jquery.js");
});
app.get('/js/game.js', function(req, res) {
    res.sendFile(__dirname + "/web/js/game.js");
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/web/index.html");
});

server.listen(3600);
console.log("SERVER LISTENING");

var HeroesInstance = Heroes.create();
var EnemiesInstance = Enemies.create();
var LocationsInstance = Locations.create();
Debug.init();

module.exports = {
    Heroes: HeroesInstance,
    Enemies: EnemiesInstance,
    Locations: LocationsInstance
};

var io = require('socket.io')(server,{});
var heroNewId = 0;
io.sockets.on('connection', function(socket) {
    heroNewId++;
    HeroesInstance.createHero(socket, heroNewId);
    HeroRoute.init(HeroesInstance.getHero(socket.getHeroId()));
    Debug.getInstance().addHeroDebug(socket);
    console.log("HERO " + socket.getHeroId() + " CONNECTED");

    socket.on('disconnect', function() {

    })
});
console.log("SOCKETS LISTENING");

// setInterval(function() {
//     var memory = process.memoryUsage();
//     var status = "";
//     for (var key in memory) {
//         status += key + "=" + (Math.round((memory[key] / 1024 / 1024) * 100) / 100) + "MB\t";
//     }
//     console.log(status);
// }, 3000);

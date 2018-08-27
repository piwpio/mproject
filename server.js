var Heroes = require("./Controllers/HeroesController");
var Locations = require("./Controllers/LocationsController");
var Enemies = require("./Controllers/EnemiesController");
// var Debug = require("./Controllers/DebugController");
var HeroRoute = require("./Controllers/HeroRouteController");
var StaticData = require("./Controllers/StaticDataController");
var EnemiesQueue = require("./Queues/EnemiesQueue");

var express = require("express");
var app = express();
var server = require("http").Server(app);
console.log("SERVER STARTED");

server.listen(3600);
console.log("SERVER LISTENING");

let StaticDataInstance = StaticData.create();
let HeroesInstance = Heroes.create();
let EnemiesInstance = Enemies.create();
let LocationsInstance = Locations.create();
let EnemiesQueueInstance = EnemiesQueue.create();
// let DebugInstance = Debug.create();

module.exports = {
    Heroes: HeroesInstance,
    Enemies: EnemiesInstance,
    Locations: LocationsInstance,
    EnemiesQueue: EnemiesQueueInstance
};

LocationsInstance.setAllEnemiesLocationId();

var io = require('socket.io')(server,{});
var heroNewId = 0;
io.sockets.on('connection', function(socket) {
    //static data
    socket.on('checksum', function() {
        socket.emit('checksum', StaticDataInstance.getControlCode());
    });
    socket.on('static_data', function() {
        socket.emit('static_data', StaticDataInstance.getStaticData());
    });

    heroNewId++;
    HeroesInstance.createHero(socket, heroNewId);
    HeroRoute.init(HeroesInstance.getHero(socket.getHeroId()));
    // DebugInstance.addHeroDebug(socket);
    console.log("HERO " + socket.getHeroId() + " CONNECTED");
    socket.emit('connected');
});
console.log("SOCKETS LISTENING");

//enemy moves cron
setInterval(function() {
    let queue = EnemiesQueueInstance.getQueue();
    for (let enemyId in queue) {
        let enemy = EnemiesInstance.getEnemy(enemyId);
        enemy.cronAction();
    }
}, 1000);


// setInterval(function() {
//     var memory = process.memoryUsage();
//     var status = "";
//     for (var key in memory) {
//         status += key + "=" + (Math.round((memory[key] / 1024 / 1024) * 100) / 100) + "MB\t";
//     }
//     console.log(status);
// }, 3000);

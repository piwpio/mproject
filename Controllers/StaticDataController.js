var LocationConstants = require("../Constants/LocationsConstants");
var EnemiesBaseConstants = require("../Constants/EnemiesBaseConstants");

var StaticDataController = function()
{
    this.static = {};
    this.controlCode = Date.now();
    this.static.dead_location_id = LocationConstants.getDeadId();
    this.static.locations = {};
    let locationsRaw = LocationConstants.getAll();
    for (var locId in locationsRaw) {
        locId = parseInt(locId);
        let location = locationsRaw[locId];
        this.static.locations[locId] = {
            moves: location.moves || {}
        };
    }

    // let enemiesRaw = EnemiesBaseConstants.getAll();
    // for (let name in EnemiesBaseConstants) {
    //     let enemy = enemiesRaw[name];
    //     this.static.locations[name] = {
    //         moves: location.moves || {}
    //     };
    // }
    //
    // this.static.enemies = {};
};

StaticDataController.prototype.getStaticData = function()
{
    return this.static;
};

StaticDataController.prototype.getControlCode = function()
{
    return this.controlCode;
};


var create = function()
{
    return new StaticDataController();
};

module.exports = {
    create,
};
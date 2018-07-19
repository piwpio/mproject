var Location = require("./LocationController");
var LocationConstants = require("../Constants/LocationsConstants");

var Locations2 = function()
{
    this._locations = {};
    let locationsRaw = LocationConstants.getAll();
    for (var locId in locationsRaw) {
        locId = parseInt(locId);
        let location = locationsRaw[locId];
        this._locations[locId] = Location.create(
            locId,
            location.moves     || {},
            location.enemies   || []
        );
    }
};

Locations2.prototype.getLocation = function(locId)  {return this._locations[locId];};
Locations2.prototype.setAllEnemiesLocationId = function(locId)
{
    for (let locationId in this._locations) {
        let location = this._locations[locationId];
        location.initEnemies();
    }
};


var create = function()
{
    return new Locations2();
};

module.exports = {
    create,
};
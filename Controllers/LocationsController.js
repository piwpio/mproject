var Location = require("./LocationController");
var LocationConstants = require("../Constants/LocationsConstants");

var Locations2 = function()
{
    this._locations = {};
    var locationsRaw = LocationConstants.getAll();
    for (var locId in locationsRaw) {
        var location = locationsRaw[locId];
        this._locations[locId] = Location.create(
            locId,
            location.moves     || {},
            location.enemies   || {}
        );
    }
};

Locations2.prototype.getLocations = function()      {return this._locations;};
Locations2.prototype.getLocation = function(locId)  {return this._locations[locId];};


var create = function()
{
    return new Locations2();
};
module.exports = {
    create,
};
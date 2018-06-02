var Location = require("./LocationController");

var LOCATIONS_RAW = {
    1: {
        id: 1,
        t: 'f', // terrain type
        e: [],   //enemies
        m: [2,null]   //moves - 0 left, 1 right
    },
    2: {
        id: 2,
        t: 'f', // terrain type
        e: [],   //enemies
        m: [3,1]   //moves - 0 left, 1 right
    },
    3: {
        id: 3,
        t: 'f', // terrain type
        e: [],   //enemies
        m: [null,2]   //moves - 0 left, 1 right
    }
};

var LocationInstance = undefined;
var init = function()
{
    if (LocationInstance === undefined) {
        LocationInstance = (new Locations()).init();
    }
    return LocationInstance;
};
var getInstance = function()
{
    return LocationInstance;
};

var Locations = function()
{
    var self = this;
    var LOCATIONS = {};

    self.init = function()
    {
        for (var key in LOCATIONS_RAW) {
            var l = LOCATIONS_RAW[key];
            LOCATIONS[l.id] = Location.init(l);
        }
        return self;
    };

    self.getLocations = function()
    {
        return LOCATIONS;
    };

    self.getLocation = function(locationId)
    {
        return LOCATIONS[locationId];
    };
};

module.exports = {
    init,
    getInstance
};

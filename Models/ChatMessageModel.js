var execute = function(hero, message)
{
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);
    currentLocation.heroChatMessage(hero, message);

    hero.sendResponse();
};

module.exports = {
    execute
};

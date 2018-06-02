var execute = function(hero)
{
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);
    currentLocation.addHeroToLocation(hero);
    hero.sendResponse();
};

module.exports = {
    execute
};

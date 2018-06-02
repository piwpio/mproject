var execute = function(hero)
{
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);
    if (currentLocation.canGoLeft()) {
        var newLocationId = currentLocation.getLeftLocationId();
        var newLocation = Locations.getLocation(newLocationId);
        hero.setLocation(newLocationId);
        //send heroes on current location info, that hero just moved from this location
        currentLocation.removeHeroFromLocation(hero);
        //send heroes on new location info, that hero just moved to this location
        newLocation.addHeroToLocation(hero);

    } else {
        hero.emitError({message: 'cant go left'});
        return;
    }

    hero.sendResponse();
};

module.exports = {
    execute
};

var execute = function(hero)
{
    if (!hero.canHeroAction()) {
        hero.emitError({message: 'cant do action yet'});
        return;
    }

    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);
    if (currentLocation.canGoRight()) {
        var newLocationId = currentLocation.getRightLocationId();
        var newLocation = Locations.getLocation(newLocationId);
        hero.setLocation(newLocationId);
        //send heroes on current location info, that hero just moved from this location
        currentLocation.removeHeroFromLocation(hero, 1);
        //send heroes on new location info, that hero just moved to this location
        newLocation.addHeroToLocation(hero, 0);

    } else {
        hero.emitError({message: 'cant go right'});
        return;
    }

    hero.sendResponse();
};

module.exports = {
    execute
};

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
        // var newLocation = Locations.getLocation(newLocationId);
        var responseId = hero.createNewResponse();
        hero.setLocation(newLocationId, responseId);
        // currentLocation.removeHeroFromLocation(hero, 1);
        // newLocation.addHeroToLocation(hero, 0);
        hero.closeResponse(responseId);
        hero.setLastHeroAction();

    } else {
        hero.emitError({message: 'cant go right'});
    }
};

module.exports = {
    execute
};

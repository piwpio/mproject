var execute = function(hero)
{
    if (!hero.canHeroAction()) {
        hero.emitError({message: 'cant do action yet'});
        return;
    }

    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);
    if (currentLocation.canGoLeft()) {
        var newLocationId = currentLocation.getLeftLocationId();
        // var newLocation = Locations.getLocation(newLocationId);
        var responseId = hero.createNewResponse();
        hero.setLocation(newLocationId, responseId);
        //send heroes on current location info, that hero just moved from this location
        // currentLocation.removeHeroFromLocation(hero, 0);
        //send heroes on new location info, that hero just moved to this location
        // newLocation.addHeroToLocation(hero, 1);
        hero.closeResponse(responseId);
        hero.setLastHeroAction();

    } else {
        hero.emitError({message: 'cant go left'});
    }

};

module.exports = {
    execute
};

var execute = function(hero)
{
    if (!hero.canHeroAction()) {
        hero.emitError({message: 'cant do action yet'});
        return;
    }

    var locationId = hero.getLocation();
    var LocationsInstance = module.parent.parent.exports.Locations;
    var currentLocation = LocationsInstance.getLocation(locationId);

    if (currentLocation.canGoLeft()) {
        var newLocationId = currentLocation.getLeftLocationId();

        hero.setLocation(newLocationId);
        hero.setLastHeroAction();
        hero.sendResponse();

        currentLocation.removeHeroFromLocation(hero.getId());
        currentLocation.broadcastResponse(hero.getId(), {
            hero_remove: [hero.getId(), 'left']
        });

        var newLocation = LocationsInstance.getLocation(newLocationId);
        newLocation.addHeroToLocation(hero.getId());
        newLocation.broadcastResponse(hero.getId(), {
            hero_add: [hero.getId(), 'right']
        });

    } else {
        hero.emitError({message: 'cant go left'});
    }

};

module.exports = {
    execute
};

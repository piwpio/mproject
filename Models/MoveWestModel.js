var execute = function(hero)
{
    if (!hero.canHeroMoveAction()) {
        hero.emitError({message: 'cant do move action yet'});
        return;
    }

    var locationId = hero.getLocation();
    var LocationsInstance = module.parent.parent.exports.Locations;
    var currentLocation = LocationsInstance.getLocation(locationId);

    if (currentLocation.canGoWest()) {
        var newLocationId = currentLocation.getWestLocationId();

        hero.setLocation(newLocationId);
        hero.setNextHeroMoveAction();
        hero.sendResponse();

        currentLocation.removeHeroFromLocation(hero.getId());
        currentLocation.broadcastResponse(hero.getId(), {
            hero_remove: [hero.getId(), 'west']
        });

        var newLocation = LocationsInstance.getLocation(newLocationId);
        newLocation.addHeroToLocation(hero.getId());
        newLocation.broadcastResponse(hero.getId(), {
            hero_add: [hero.getId(), 'east']
        });

        hero.emitCustomResponse('new_location_response', newLocation.getHeroNewLocationObject(hero.getId()));

    } else {
        hero.emitError({message: 'cant go west'});
    }

};

module.exports = {
    execute
};

var execute = function(hero)
{
    if (!hero.canHeroMoveAction()) {
        hero.emitError({message: 'cant do move action yet'});
        return;
    }

    var locationId = hero.getLocation();
    var LocationsInstance = module.parent.parent.exports.Locations;
    var currentLocation = LocationsInstance.getLocation(locationId);

    if (currentLocation.canGoEast()) {
        var newLocationId = currentLocation.getEastLocationId();

        hero.setLocation(newLocationId);
        hero.setNextHeroMoveAction();
        hero.sendResponse();

        currentLocation.removeHeroFromLocation(hero.getId());
        currentLocation.broadcastResponse(hero.getId(), {
            hero_remove: [hero.getId(), 'east']
        });

        var newLocation = LocationsInstance.getLocation(newLocationId);
        newLocation.addHeroToLocation(hero.getId());
        newLocation.broadcastResponse(hero.getId(), {
            hero_add: [hero.getId(), 'west']
        });

        hero.emitCustomResponse('new_location_response', newLocation.getHeroNewLocationObject(hero.getId()));

    } else {
        hero.emitError({message: 'cant go east'});
    }

};

module.exports = {
    execute
};

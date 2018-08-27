var execute = function(hero)
{
    if (!hero.canHeroMoveAction()) {
        hero.emitError({message: 'cant do move action yet'});
        return;
    }

    let locationId = hero.getLocation();
    let LocationsInstance = module.parent.parent.exports.Locations;
    let currentLocation = LocationsInstance.getLocation(locationId);

    if (currentLocation.canGoWest()) {
        let newLocationId = currentLocation.getWestLocationId();

        hero.setLocation(newLocationId);
        hero.setNextHeroMoveAction();
        hero.sendResponse();

        currentLocation.removeHeroFromLocation(hero.getId());
        currentLocation.broadcastResponse(hero.getId(), {
            hero_remove: {
                id: hero.getId(),
                side: 'west'
            }
        });

        let newLocation = LocationsInstance.getLocation(newLocationId);
        newLocation.addHeroToLocation(hero.getId());
        newLocation.broadcastResponse(hero.getId(), {
            hero_add: {
                hero: hero.getHeroViewForOtherHero(),
                side: 'east'
            }
        });

        hero.emitCustomResponse('new_location_response', newLocation.getLocationForNewHeroObject(hero.getId()));

    } else {
        hero.emitError({message: 'cant go west'});
    }

};

module.exports = {
    execute
};

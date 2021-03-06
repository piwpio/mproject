var execute = function(hero)
{
    var locationId = hero.getLocation();
    var LocationsInstance = module.parent.parent.exports.Locations;
    var location = LocationsInstance.getLocation(locationId);

    hero.addInitToResponse();
    hero.setLocation(location.getId());
    location.addHeroToLocation(hero.getId());
    hero.sendResponse();
    location.broadcastResponse(hero.getId(), {
        hero_add: {
            hero: hero.getHeroViewForOtherHero(),
            side: 'login'
        }
    });

    hero.emitCustomResponse('new_location_response', location.getLocationForNewHeroObject(hero.getId()));
};

module.exports = {
    execute
};

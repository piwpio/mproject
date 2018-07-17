var execute = function(hero)
{
    var locationId = hero.getLocation();
    var LocationsInstance = module.parent.parent.exports.Locations;
    var location = LocationsInstance.getLocation(locationId);

    hero.setLocation(location.getId());
    location.addHeroToLocation(hero.getId());
    hero.sendResponse();
    location.broadcastResponse(hero.getId(), {
        hero_add: [hero.getId(), 'login']
    });
};

module.exports = {
    execute
};

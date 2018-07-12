var execute = function(hero)
{
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);

    var hrid = hero.createNewResponse();
    hero.setLocation(currentLocation.getId(), hrid);
    hero.closeResponse(hrid);

    var lrid = currentLocation.createNewResponse();
    currentLocation.addHeroToLocation(lrid, hero, 'login');
    currentLocation.closeResponse(lrid);
};

module.exports = {
    execute
};

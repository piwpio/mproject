var execute = function(hero)
{
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var HeroResponse = module.parent.parent.exports.HeroResponse;
    var currentLocation = Locations.getLocation(locationId);

    console.log(HeroResponse);
    var hrid = HeroResponse.createNewHeroResponse(hero);
    // HeroResponse.setLocation(hrid, currentLocation.getId());
    HeroResponse.setLocation(hrid, 2);
    HeroResponse.closeResponse(hrid);

    // var lrid = currentLocation.createNewResponse();
    // currentLocation.addHeroToLocation(lrid, hero, 'login');
    // currentLocation.closeResponse(lrid);
};

module.exports = {
    execute
};

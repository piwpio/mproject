var execute = function(hero, message)
{
    var locationId = hero.getLocation();
    var LocationsInstance = module.parent.parent.exports.Locations;
    var location = LocationsInstance.getLocation(locationId);
    location.broadcastResponse(hero.getId(),
        [hero.getName(), hero.getId(), message]
    , 'chat_response');
};

module.exports = {
    execute
};

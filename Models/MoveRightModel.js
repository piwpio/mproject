var Locations = require("../Controllers/LocationsController");
var execute = function(hero)
{
    var locationId = hero.getLocation();
    var currentLocation = Locations.getInstance().getLocation(locationId);

    if (currentLocation.canGoRight()) {
        hero.setLocation(currentLocation.getRightLocationId());
    } else {
        hero.emitError({message: 'cant go right'});
        return;
    }

    hero.sendResponse();
};

module.exports = {
    execute
};

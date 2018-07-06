var execute = function(hero, enemyId, enemyType)
{
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);

    if (enemyType === 'h') {

    } else {
        currentLocation.getEnemy(enemyId)
    }


    hero.sendResponse();
};

module.exports = {
    execute
};

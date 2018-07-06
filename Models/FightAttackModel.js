var execute = function(hero, enemyId, enemyType)
{
    var attackerId = hero.getId();
    var attackerAttack = hero.getAttack();
    var attackerAttackSpeed = hero.getAttackSpeed();
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);
    if (enemyType === 'h') {

    } else {
        var enemy = currentLocation.getEnemy(enemyId);
        if (!enemy) {
            return;
        }
        if (!enemy.isAlive) {
            return;
        }
        if (!enemy.canHeroAttack(attackerId, attackerAttackSpeed)) {
            return;
        }
        enemy.takeAttack(attackerId, attackerAttack);
        currentLocation.updateEnemy(enemyId);

    }

    // hero.sendResponse();
};

module.exports = {
    execute
};

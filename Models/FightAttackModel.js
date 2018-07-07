var execute = function(hero, enemyId, enemyType)
{
    if (!hero.canHeroAction()) {
        hero.emitError({message: 'cant do action yet'});
        return;
    }

    var heroId = hero.getId();
    var locationId = hero.getLocation();
    var Locations = module.parent.parent.exports.Locations;
    var currentLocation = Locations.getLocation(locationId);
    if (enemyType === 'h') {

    } else {
        var enemy = currentLocation.getEnemy(enemyId);
        if (!enemy) {
            hero.emitError({message: 'no enemy with id ' + enemyId + ' on location ' + locationId});
            return;
        }
        if (!enemy.isAlive()) {
            hero.emitError({message: 'enemy is dead already'});
            return;
        }

        if (hero.getAttackSpeed() >= enemy.getAttackSpeed()) {
            //hero attack first
            enemy.takeAttack(heroId, hero.getAttack());
            if (enemy.isAlive()) {
                console.log('enemy still alive');
                // hero.takeAttack(enemy.getAttack());
            } else {
                //rewards
                // var damageTotal = 0;
                // var attackHeroes = enemy.getHeroesWhichAttacked();
                // for (var hId in attackHeroes) {
                //     if (currentLocation.isHeroOnLocation(heroId)){
                //         var exp = Math.round((attackHeroes[hId]/enemy.getMaxHp()) * 100);
                //
                //     }
                // }

                console.log('enemy dead');
            }

        } else {
            //enemy attack first
            // hero.takeAttack(enemy.getAttack());
            // if (hero.isAlive()) {
            //     enemy.takeAttack(heroId, hero.getAttack());
            // }
        }

        currentLocation.broadcastEnemy(enemyId, hero);
    }

    hero.setLastHeroAction();
    hero.sendResponse();
};

module.exports = {
    execute
};

var execute = function(hero, enemyId, enemyType)
{
    // if (!hero.canHeroAction()) {
    //     hero.emitError({message: 'cant do action yet'});
    //     return;
    // }

    var locationId = hero.getLocation();
    var LocationsInstance = module.parent.parent.exports.Locations;
    var location = LocationsInstance.getLocation(locationId);
    if (enemyType === 'h') {

    } else {
        var enemy = location.getEnemy(enemyId);
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
            enemy.takeAttack(hero);
            if (enemy.isAlive()) {
                // console.log('enemy still alive');
                hero.takeAttack(enemy);
            } else {
                //rewards
                var damageTotalByHeroesOnLocation = 0;
                var attackHeroes = enemy.getHeroesWhichAttacked();
                var heroesOnLocationIds = [];
                var hid;
                for (hid in attackHeroes) {
                    if (location.isHeroOnLocation(hid)){
                        heroesOnLocationIds.push(hid);
                        damageTotalByHeroesOnLocation += attackHeroes[hid];
                    }
                }
                for (hid in heroesOnLocationIds) {
                    var exp = Math.round((attackHeroes[hid]/damageTotalByHeroesOnLocation) * 100);
                    var h = location.getHeroOnLocation(hid);
                    if (h) {
                        h.setExp(h.getExp() + exp);
                    }
                }

                console.log('enemy dead');
            }

        } else {
            //enemy attack first
            // hero.takeAttack(enemy.getAttack());
            // if (hero.isAlive()) {
            //     enemy.takeAttack(heroId, hero.getAttack());
            // }
        }

        location.broadcastEnemy(enemyId, hero);
    }

    hero.setLastHeroAction();
    hero.sendResponse();
};

module.exports = {
    execute
};

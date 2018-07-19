var LocationConstants = require("../Constants/LocationsConstants");

var execute = function(hero, enemyId, enemyType)
{
    if (!hero.canHeroAttackAction()) {
        hero.emitError({message: 'cant do attack action yet'});
        return;
    }

    let locationId = hero.getLocation();
    let LocationsInstance = module.parent.parent.exports.Locations;
    let location = LocationsInstance.getLocation(locationId);
    if (enemyType === 'h') {

    } else {
        var enemy = location.getEnemyOnLocation(enemyId);
        if (!enemy) {
            hero.emitError({message: 'no enemy with id ' + enemyId + ' on location ' + locationId});
            return;
        }
        if (!enemy.isAlive()) {
            hero.emitError({message: 'enemy is dead already'});
            return;
        }

        let EnemyQueueInstance = module.parent.parent.exports.EnemiesQueue;

        if (!EnemyQueueInstance.isEnemyInQueue(enemyId)) {
            EnemyQueueInstance.addToQueue(enemyId);
        }
        enemy.takeAttack(hero);
        if (!enemy.isAlive()) {
            let damageTotalByHeroesOnLocation = 0;
            let attackHeroes = enemy.getHeroesWhichAttackedDamage();
            let heroesOnLocationIds = [];
            let hid;
            for (hid in attackHeroes) {
                if (location.isHeroOnLocation(hid)){
                    heroesOnLocationIds.push(hid);
                    damageTotalByHeroesOnLocation += attackHeroes[hid];
                }
            }
            for (hid of heroesOnLocationIds) {
                let exp = Math.floor((attackHeroes[hid]/damageTotalByHeroesOnLocation) * enemy.getExp());
                let h = location.getHeroOnLocation(hid);
                if (h) {
                    h.addExp(exp);
                    h.sendResponse();
                }
            }
        }
        location.broadcastEnemy(enemyId, hero);
        hero.setLastHeroAttackAction();
    }
};

module.exports = {
    execute
};

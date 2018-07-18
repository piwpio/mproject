var LocationConstants = require("../Constants/LocationsConstants");

var execute = function(hero, enemyId, enemyType)
{
    if (!hero.canHeroAction()) {
        hero.emitError({message: 'cant do action yet'});
        return;
    }

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
            // console.log('hero attack first');
            enemy.takeAttack(hero);
            if (enemy.isAlive()) {
                hero.takeAttack(enemy);
                if (!hero.isAlive()) {
                    hero.setLocation(LocationConstants.getDeadId());
                    hero.sendResponse();

                    location.removeHeroFromLocation(hero.getId());
                    location.broadcastResponse(hero.getId(), {
                        hero_remove: [hero.getId(), 'dead']
                    });

                    let deadLocation = LocationsInstance.getLocation(LocationConstants.getDeadId());
                    deadLocation.addHeroToLocation(hero.getId());
                    deadLocation.broadcastResponse(hero.getId(), {
                        hero_add: [hero.getId(), 'dead']
                    });

                } else {
                    hero.setLastHeroAction();
                    hero.sendResponse();
                }
                location.broadcastEnemy(enemyId, hero);

            } else {
                //rewards
                let damageTotalByHeroesOnLocation = 0;
                let attackHeroes = enemy.getHeroesWhichAttacked();
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
                location.broadcastEnemy(enemyId, hero);
            }

        } else {
            // console.log('enemy attack first');
            hero.takeAttack(enemy);
            if (hero.isAlive()) {
                enemy.takeAttack(hero);
                if (!enemy.isAlive()) {
                    let damageTotalByHeroesOnLocation = 0;
                    let attackHeroes = enemy.getHeroesWhichAttacked();
                    let heroesOnLocationIds = [];
                    let hid;
                    for (hid in attackHeroes) {
                        if (location.isHeroOnLocation(hid)) {
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

                } else {
                    hero.sendResponse();
                }
                location.broadcastEnemy(enemyId, hero);
                hero.setLastHeroAction();

            } else {
                //hero dead
                hero.setLocation(LocationConstants.getDeadId());
                hero.sendResponse();

                location.removeHeroFromLocation(hero.getId());
                location.broadcastResponse(hero.getId(), {
                    hero_remove: [hero.getId(), 'dead']
                });

                let deadLocation = LocationsInstance.getLocation(LocationConstants.getDeadId());
                deadLocation.addHeroToLocation(hero.getId());
                deadLocation.broadcastResponse(hero.getId(), {
                    hero_add: [hero.getId(), 'dead']
                });

                location.broadcastEnemy(enemyId, hero);
            }
        }
    }
};

module.exports = {
    execute
};

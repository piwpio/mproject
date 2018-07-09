var Enemy = require("./EnemyController");
var DEFAULT_ENEMIES = {
    'wolf': [1, 10, 1, 1, 1, 100] // [lvl, hp, attack, defence, attackSpeed, exp]
};

var init = function(locationData)
{
    return (new Location).init(
        locationData.id,
        locationData.t,
        locationData.m,
        locationData.e
    );
};

var Location = function()
{
    var self = this;

    self.id = null;
    self.terrain = null;
    self.moves = null;
    self.enemies = null;
    self.heroesOnLocation = null;

    self.init = function(id, terrain, moves, enemies)
    {
        self.id = id;
        self.terrain = terrain;
        self.moves = moves;
        self.enemies = initEnemies(enemies);
        self.heroesOnLocation = {};

        return self;
    };

    var initEnemies = function(enemies)
    {
        var a = {};
        for (var i = 0; i < enemies.length; i++) {
            var name = enemies[i][0];
            a[i] = Enemy.init(
                name, //name
                enemies[i][1] || DEFAULT_ENEMIES[name][0], //lvl
                enemies[i][2] || DEFAULT_ENEMIES[name][1], //hp
                enemies[i][3] || DEFAULT_ENEMIES[name][2], //attack
                enemies[i][4] || DEFAULT_ENEMIES[name][3], //defence
                enemies[i][5] || DEFAULT_ENEMIES[name][4], //attack speed
                enemies[i][6] || DEFAULT_ENEMIES[name][5], //exp points
            );
        }
        return a;
    };

    self.canGoLeft = function()
    {
        return self.moves[0] !== null
    };
    self.canGoRight = function()
    {
        return self.moves[1] !== null
    };

    self.getLeftLocationId = function()
    {
        return self.moves[0];
    };
    self.getRightLocationId = function()
    {
        return self.moves[1];
    };

    self.addHeroToLocation = function(hero, side)
    {
        //send heroes on new location info, that hero just moved to this location
        self.heroesOnLocation[hero.getId()] = 1;
        var HeroesInstance = module.parent.parent.exports.Heroes;
        var heroesOnLocation = [];
        for (var heroId in self.heroesOnLocation) {
            heroId = parseInt(heroId);
            if (hero.getId() == heroId) {
                continue;
            }
            heroesOnLocation.push(heroId);
            HeroesInstance
                .getHero(heroId)
                .responseAddKey('location', {
                    addhero:[hero.id, side]
                })
                .sendResponse();
        }
        if (heroesOnLocation.length) {
            hero.responseAddKey('location', {
                heroes: heroesOnLocation
            });
        }
    };
    self.removeHeroFromLocation = function(hero, side)
    {
        //send heroes on current location info, that hero just moved from this location
        delete self.heroesOnLocation[hero.getId()];
        var HeroesInstance = module.parent.parent.exports.Heroes;
        for (var heroId in self.heroesOnLocation) {
            if (hero.getId() == heroId) {
                continue;
            }
            HeroesInstance
                .getHero(heroId)
                .responseAddKey('location', {
                    rmhero: [hero.id, side]
                })
                .sendResponse();
        }
    };

    self.getHeroesIdsOnLocation = function()
    {
        return self.heroesOnLocation;
    };

    self.getHeroOnLocation = function(heroId)
    {
        if (self.isHeroOnLocation(heroId)) {
            var HeroesInstance = module.parent.parent.exports.Heroes;
            HeroesInstance.getHero(heroId);
        } else {
            return null;
        }
    };

    self.isHeroOnLocation = function(heroId)
    {
        return !!self.heroesOnLocation[heroId];
    };

    self.heroChatMessage = function(hero, message)
    {
        var HeroesInstance = module.parent.parent.exports.Heroes;
        for (var heroId in self.heroesOnLocation) {
            if (hero.getId() == heroId) {
                continue;
            }
            HeroesInstance
                .getHero(heroId)
                .responseAddKey('chat', {
                    m: [hero.id, message]
                })
                .sendResponse();
        }
    };

    self.getEnemy = function(enemyId)
    {
        return self.enemies[enemyId] || null;
    };

    self.broadcastEnemy = function(enemyId, hero)
    {
        var HeroesInstance = module.parent.parent.exports.Heroes;
        var enemy = self.getEnemy(enemyId);
        for (var heroId in self.heroesOnLocation) {
            heroId = parseInt(heroId);
            var r = {};
            r[enemyId] = {
                hp: enemy.getHp(),
                et: 'm'
            };
            if (hero.getId() !== heroId) {
                r[enemyId]['a'] = hero.getId();
                HeroesInstance
                    .getHero(heroId)
                    .responseAddKey('enemy', r)
                    .sendResponse();
            } else {
                hero
                    .responseAddKey('enemy', r)
            }
        }
    };
};

module.exports = {
    init: init
};

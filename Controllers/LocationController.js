var create = function(id, moves, enemies)
{
    return new Location2(id, moves, enemies);
};
module.exports = {
    create: create
};


var Enemy = require("./EnemyController");
var EnemiesConstants = require("../Constants/EnemiesConstants");
var ResponseController = require("./ResponseController");

var Location2 = function(id, moves, enemies)
{
    ResponseController.call(this, 'location_response', 'location');

    this._id = id;
    this._moves = moves;
    this._enemies = this._createEnemies(enemies);

    this._heroesOnLocation = {};
};
Location2.prototype = Object.create(ResponseController.prototype);

Location2.prototype.getId = function()  { return this._id };
Location2.prototype.canGoLeft = function()   { return this._moves.left !== undefined };
Location2.prototype.canGoRight = function()  { return this._moves.right !== undefined };
Location2.prototype.getLeftLocationId = function()   { return this._moves.left; };
Location2.prototype.getRightLocationId = function()  { return this._moves.right; };
Location2.prototype.isHeroOnLocation = function(heroId) { return !!self._heroesOnLocation[heroId]; };
Location2.prototype.getEnemy = function(enemyId) { return self.enemies[enemyId] || null; };

Location2.prototype._createEnemies = function(enemies)
{
    var a = {};
    var index = 0;
    for (var name in enemies) {
        var enemy = enemies[name];
        var enemiesRaw =  EnemiesConstants.getAll();
        a[index++] = Enemy.create(
            name,
            enemy.level         || enemiesRaw[name].level,
            enemy.hp            || enemiesRaw[name].hp,
            enemy.attack        || enemiesRaw[name].attack,
            enemy.defence       || enemiesRaw[name].defence,
            enemy.attack_speed  || enemiesRaw[name].attack_speed,
            enemy.exp           || enemiesRaw[name].exp
        );
    }
    return a;
};

Location2.prototype.getHeroOnLocationSockets = function(responseId)
{
    var HeroesInstance = module.parent.parent.exports.Heroes;
    console.log('BBB');
    var aa = [];
    for (var heroId in this._heroesOnLocation) {
        console.log(heroId);
        aa.push(HeroesInstance.getHero(heroId).getSocket());
    }
};

Location2.prototype.addHeroToLocation = function(responseId, hero, side)
{
    this._heroesOnLocation[hero.getId()] = 1;
    this.setResponseTriggeredBy(responseId, hero.getId());
    this.responseAddKey(responseId, 'add_hero', [hero.getId(), side])
};

Location2.prototype.removeHeroFromLocation = function(responseId, hero, side)
{
    delete this._heroesOnLocation[hero.getId()];
    this.responseAddKey(responseId, 'rm_hero', [hero.getId(), side])
};

Location2.prototype.getHeroOnLocation = function(heroId)
{
    if (self.isHeroOnLocation(heroId)) {
        var HeroesInstance = module.parent.parent.exports.Heroes;
        HeroesInstance.getHero(heroId);
    } else {
        return null;
    }
};

Location2.prototype.heroChatMessage = function(hero, message)
{
    // var HeroesInstance = module.parent.parent.exports.Heroes;
    // for (var heroId in self.heroesOnLocation) {
    //     if (hero.getId() == heroId) {
    //         continue;
    //     }
    //     HeroesInstance
    //         .getHero(heroId)
    //         .responseAddKey('chat', {
    //             m: [hero.id, message]
    //         })
    //         .sendResponse();
    // }
};

Location2.prototype.broadcastEnemy = function(enemyId, hero)
{
    // var HeroesInstance = module.parent.parent.exports.Heroes;
    // var enemy = self.getEnemy(enemyId);
    // for (var heroId in self.heroesOnLocation) {
    //     heroId = parseInt(heroId);
    //     var r = {};
    //     r[enemyId] = {
    //         hp: enemy.getHp(),
    //         et: 'm'
    //     };
    //     if (hero.getId() !== heroId) {
    //         r[enemyId]['a'] = hero.getId();
    //         HeroesInstance
    //             .getHero(heroId)
    //             .responseAddKey('enemy', r)
    //             .sendResponse();
    //     } else {
    //         hero
    //             .responseAddKey('enemy', r)
    //     }
    // }
};

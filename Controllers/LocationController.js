var create = function(id, moves, enemies)
{
    return new Location2(id, moves, enemies);
};
module.exports = {
    create: create
};


var Enemy = require("./EnemyController");
var EnemiesConstants = require("../Constants/EnemiesConstants");

var Location2 = function(id, moves, enemies)
{
    // ResponseController.call(this, 'location_response', 'location');

    this._id = id;
    this._moves = moves;
    this._enemies = this._createEnemies(enemies);

    this._heroesOnLocation = {};
};
// Location2.prototype = Object.create(ResponseController.prototype);

Location2.prototype.getId = function()  { return this._id };
Location2.prototype.canGoLeft = function()   { return this._moves.left !== undefined };
Location2.prototype.canGoRight = function()  { return this._moves.right !== undefined };
Location2.prototype.getLeftLocationId = function()   { return this._moves.left; };
Location2.prototype.getRightLocationId = function()  { return this._moves.right; };
Location2.prototype.isHeroOnLocation = function(heroId) { return !!this._heroesOnLocation[heroId]; };
Location2.prototype.getEnemy = function(enemyId) { return this._enemies[enemyId] || null; };

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

Location2.prototype.addHeroToLocation = function(heroId)
{
    this._heroesOnLocation[heroId] = 1;
};

Location2.prototype.removeHeroFromLocation = function(heroId)
{
    delete this._heroesOnLocation[heroId];
};

Location2.prototype.getHeroOnLocation = function(heroId)
{
    if (this.isHeroOnLocation(heroId)) {
        var HeroesInstance = module.parent.parent.exports.Heroes;
        return HeroesInstance.getHero(heroId);
    } else {
        return null;
    }
};

Location2.prototype.broadcastResponse = function(senderId, object)
{
    var HeroesInstance = module.parent.parent.exports.Heroes;
    for (var heroId in this._heroesOnLocation) {
        if (senderId == parseInt(heroId)) {
            continue;
        }
        HeroesInstance.getHero(heroId).getSocket().emit('location_response', object);
    }
};

Location2.prototype.broadcastResponseAll = function(object)
{
    this.broadcastResponse(0, object);
};

Location2.prototype.broadcastEnemy = function(enemyId)
{
    var enemy = this.getEnemy(enemyId);
    var r = {};
    r[enemyId] = enemy.getResponse();
    this.broadcastResponseAll({enemy: r});
    enemy.cleanResponse();
};

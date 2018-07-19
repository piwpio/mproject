var Enemy = require("./EnemyController");
var EnemiesConstants = require("../Constants/EnemiesConstants");
var EnemiesBaseConstants = require("../Constants/EnemiesBaseConstants");

var Enemies = function()
{
    this._enemies = {};
    var enemiesRaw = EnemiesConstants.getAll();
    var enemiesBase = EnemiesBaseConstants.getAll();
    for (var enemyId in enemiesRaw) {
        var enemy = enemiesRaw[enemyId];
        this._enemies[enemyId] = Enemy.create(
            enemyId,
            enemy.name          || enemy.base,
            enemy.level         || enemiesBase[enemy.base].level,
            enemy.hp            || enemiesBase[enemy.base].hp,
            enemy.attack        || enemiesBase[enemy.base].attack,
            enemy.defence       || enemiesBase[enemy.base].defence,
            enemy.attack_lag    || enemiesBase[enemy.base].attack_lag,
            enemy.exp           || enemiesBase[enemy.base].exp
        );
    }
};

Enemies.prototype.getEnemy = function(enemyId)  {return this._enemies[enemyId];};


var create = function()
{
    return new Enemies();
};
module.exports = {
    create,
};
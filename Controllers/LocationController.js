var Location2 = function(id, moves, enemies)
{
    // ResponseController.call(this, 'location_response', 'location');

    this._id = id;
    this._moves = moves;

    this._enemiesOnLocation = {};
    this._enemyShowQueue = [];
    for (let enemyId of enemies) {
        this.addEnemyToLocation(enemyId);
    }

    this._heroesOnLocation = {};
    this._heroesShowQueue = [];
};
// Location2.prototype = Object.create(ResponseController.prototype);

Location2.prototype.getId = function()  { return this._id };
Location2.prototype.canGoEast = function()   { return this._moves.east !== undefined };
Location2.prototype.canGoWest = function()  { return this._moves.west !== undefined };
Location2.prototype.getEastLocationId = function()   { return this._moves.east; };
Location2.prototype.getWestLocationId = function()  { return this._moves.west; };

Location2.prototype.isHeroOnLocation = function(heroId)     { return !!this._heroesOnLocation[heroId]; };
Location2.prototype.isEnemyOnLocation = function(enemyId)   { return !!this._enemiesOnLocation[enemyId]; };

Location2.prototype.initEnemies = function()
{
    var EnemiesInstance = module.parent.parent.exports.Enemies;
    for (let enemyId in this._enemiesOnLocation) {
        EnemiesInstance.getEnemy(enemyId).setLocation(this._id);
    }
};

Location2.prototype.addHeroToLocation = function(heroId)
{
    this._heroesShowQueue.push(heroId);
    this._heroesOnLocation[heroId] = 1;
};

Location2.prototype.removeHeroFromLocation = function(heroId)
{
    let index = this._heroesShowQueue.indexOf(heroId);
    if (index > -1) {
        this._heroesShowQueue.splice(index,1);
    }
    delete this._heroesOnLocation[heroId];
};

Location2.prototype.getHeroOnLocation = function(heroId)
{
    if (this.isHeroOnLocation(heroId)) {
        let HeroesInstance = module.parent.parent.exports.Heroes;
        return HeroesInstance.getHero(heroId);
    } else {
        return null;
    }
};

Location2.prototype.addEnemyToLocation = function(enemyId)
{
    this._enemyShowQueue.push(enemyId);
    this._enemiesOnLocation[enemyId] = 1;
};

Location2.prototype.removeEnemyFromLocation = function(enemyId)
{
    let index = this._enemyShowQueue.indexOf(enemyId);
    if (index > -1) {
        this._enemyShowQueue.splice(index,1);
    }
    delete this._enemiesOnLocation[enemyId];
};

Location2.prototype.getEnemyOnLocation = function(enemyId)
{
    if (this.isEnemyOnLocation(enemyId)) {
        let EnemiesInstance = module.parent.parent.exports.Enemies;
        return EnemiesInstance.getEnemy(enemyId);
    } else {
        return null;
    }
};

Location2.prototype.getLocationForNewHeroObject = function(senderId)
{
    let HeroesInstance = module.parent.parent.exports.Heroes;
    let heroes = [];
    for (let i = 0; i < this._heroesShowQueue; i++) {
        let heroId = this._heroesShowQueue[i];
        if (senderId !== heroId) {
            heroes.push(HeroesInstance.getEnemy(heroId).getHeroViewForOtherHero());
        }
    }
    for (let heroId in this._heroesOnLocation) {
        heroId = parseInt(heroId);
        if (senderId !== heroId) {
            heroes.push(HeroesInstance.getHero(heroId).getHeroViewForOtherHero());
        }
    }

    let EnemiesInstance = module.parent.parent.exports.Enemies;
    let enemies = [];
    for (let i = 0; i < this._enemyShowQueue; i++) {
        let enemyId = this._enemyShowQueue[i];
        enemies.push(EnemiesInstance.getEnemy(enemyId).getEnemyViewForOtherHero());
    }
    return {
        id: this._id,
        heroes: heroes,
        enemies: enemies
    }
};

Location2.prototype.broadcastResponse = function(senderId, object, emitKey)
{
    emitKey = emitKey || 'location_response';
    let HeroesInstance = module.parent.parent.exports.Heroes;
    for (var heroId in this._heroesOnLocation) {
        if (senderId == parseInt(heroId)) {
            continue;
        }
        HeroesInstance.getHero(heroId).getSocket().emit(emitKey, object);
    }
};

Location2.prototype.broadcastResponseAll = function(object)
{
    this.broadcastResponse(0, object);
};

Location2.prototype.broadcastEnemy = function(enemyId)
{
    let enemy = this.getEnemyOnLocation(enemyId);
    if (enemy) {
        var r = {};
        r[enemyId] = enemy.getResponse();
        this.broadcastResponseAll({enemy: r});
        enemy.cleanResponse();
    }
};


var create = function(id, moves, enemies)
{
    return new Location2(id, moves, enemies);
};
module.exports = {
    create: create
};

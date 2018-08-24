let LocationConstants = require("../Constants/LocationsConstants");

let Hero2 = function(socket, id)
{
    //TODO
    // this._id = Math.round(Math.random() * 10);
    this._id = id;
    this._socket = socket;

    //TODO
    this._location = 1;

    //TODO
    this._name = 'Warrior';
    this._level = 1;
    this._exp = 0;
    this._hp = 10;
    this._attack = 3;
    this._defence = 1;
    this._speed = 1;
    this._attackSpeed = 3;
    this._weight = 3;

    //RESPONSE
    this._isDirty = false;
    this._response = {};

    //CONTROL VARIABLES
    this._alive = true;
    this._nextMoveActionTs = 0;
    this._nextAttackActionTs = 0;

    return this;
};

//region Setters/Getters

Hero2.prototype.getId = function()     { return this._id; };
Hero2.prototype.getSocket = function() { return this._socket; };

Hero2.prototype.getLocation = function()    { return this._location;};
Hero2.prototype.setLocation = function(v)   { this._setValue('_location', v); return this; };

Hero2.prototype.getName = function()    { return this._name; };
Hero2.prototype.setName = function(v)   { this._setValue('_name', v); return this; };

Hero2.prototype.getLevel = function()   { return this._level; };
Hero2.prototype.setLevel = function(v)  { this._setValue('_level', v); return this; };

Hero2.prototype.getExp = function()     { return this._exp; };
Hero2.prototype.setExp = function(v)    { this._setValue('_exp', v); return this; };
Hero2.prototype.addExp = function(v)    { this._setValue('_exp', this._exp + v); return this; };

Hero2.prototype.getHp = function()  { return this._hp > 0 ? this._hp : 0; };
Hero2.prototype.setHp = function(v) { this._setValue('_hp', (v > 0 ? v : 0)); return this; };
Hero2.prototype.addHp = function(v) { this._setValue('_hp', this._hp + v); return this; };

Hero2.prototype.getAttack = function()  { return this._attack; };
Hero2.prototype.setAttack = function(v) { this._setValue('_attack', v); return this; };

Hero2.prototype.getDefence = function()     { return this._defence; };
Hero2.prototype.setDefence = function(v)    { this._setValue('_defence', v); return this; };

Hero2.prototype.getSpeed = function()   { return this._speed; };
Hero2.prototype.setSpeed = function(v)  { this._setValue('_speed', v); return this; };

Hero2.prototype.getAttackSpeed = function()     { return this._attackSpeed; };
Hero2.prototype.setAttackSpeed = function(v)    { this._setValue('_attackLag', v); return this; };

Hero2.prototype.getWeight = function()  { return this._weight; };
Hero2.prototype.setWeight = function(v) { this._setValue('_weight', v); return this; };

Hero2.prototype.isAlive = function() { return this._alive; };

//endregion Setters/Getters

Hero2.prototype.addInitToResponse = function()
{
    let fields = [
        '_location',
        '_name',
        '_level',
        '_exp',
        '_hp',
        '_attack',
        '_defence',
        '_speed',
        '_attackSpeed',
        '_weight'
    ];
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        this._addFieldToResponse(field, this[field]);
    }
};

Hero2.prototype.heroOnDisconnect = function()
{
    let Locations = module.parent.parent.exports.Locations;
    let location = Locations.getLocation(this._location);
    location.removeHeroFromLocation(this.getId());
};

Hero2.prototype._setValue = function(field, value)
{
    this[field] = value;
    this._addFieldToResponse(field, value);

};

Hero2.prototype._addFieldToResponse = function(field, value)
{
    if (this._response === null) {
        this._response = {};
    }
    this._response[field] = value;
    this._isDirty = true;
};

Hero2.prototype.sendResponse = function()
{
    if (this._isDirty) {
        this._socket.emit('hero_response', this._response);
        this._response = null;
        this._isDirty = false;
    }
};

Hero2.prototype.emitCustomResponse = function(emitKey, response)
{
    this._socket.emit(emitKey, response)
};

Hero2.prototype.getHeroViewForOtherHero = function()
{
    return {
        id: this._id,
        name: this._name,
    }
};

Hero2.prototype.canHeroMoveAction = function()
{
    return this._nextMoveActionTs <= Date.now();
};

Hero2.prototype.setNextHeroMoveAction = function()
{
    let diff = this._weight - this._speed;
    let speedWeight = diff > 1 ? diff * 1000  : 1000;
    this._nextMoveActionTs = Date.now() + speedWeight;
};

Hero2.prototype.canHeroAttackAction = function()
{
    return this._nextAttackActionTs <= Date.now();
};

Hero2.prototype.setNextHeroAttackAction = function()
{
    let diff = this._weight - this._attackSpeed;
    let speedWeight = diff > 1 ? diff * 1000  : 1000;
    this._nextAttackActionTs = Date.now() + speedWeight;
};

Hero2.prototype.isAlive = function()
{
    return this._hp > 0;
};

Hero2.prototype.takeAttack = function(enemy)
{
    let enemyAttack = enemy.getAttack();
    if (enemyAttack > this._defence) {
        let damage = enemyAttack - this._defence;
        let damageDealt = this._hp - damage > 0 ? damage : this._hp;
        this.setHp(this._hp - damageDealt);
    } else if (enemyAttack === this._defence) {
        //luck,
    }

    //dead
    if (this._hp <= 0) {
        this._heroIsDeadAction();
    }
};

Hero2.prototype._heroIsDeadAction = function()
{
    console.log('hero ' + this.getId() + ' is dead');
    let LocationsInstance = module.parent.parent.exports.Locations;
    this._alive = false;

    let location = LocationsInstance.getLocation(this.getLocation());
    location.removeHeroFromLocation(this.getId());
    location.broadcastResponse(this.getId(), {
        hero_remove: [this.getId(), 'dead']
    });

    let deadLocation = LocationsInstance.getLocation(LocationConstants.getDeadId());
    deadLocation.addHeroToLocation(this.getId());
    deadLocation.broadcastResponse(this.getId(), {
        hero_add: [this.getId(), 'dead']
    });

    this.setLocation(LocationConstants.getDeadId());
    this.sendResponse();
};

//region DEBUG METHODS
Hero2.prototype.emitError = function(message) {this.getSocket().emit('response_error', {message: message});};
Hero2.prototype.whoAmI =    function() {console.log('Hero', this._id);};
//endregion DEBUG METHODS


let create = function(socket,id)
{
    return new Hero2(socket, id);
};
module.exports = {
    create: create
};

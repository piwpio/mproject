
var Hero2 = function(socket, id)
{
    //TODO
    // this._id = Math.round(Math.random() * 10);
    this._id = id;
    this._socket = socket;
    this._lastActionTs = Date.now() - 10000;

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
    this._attackSpeed = 1;
    this._weight = 3;

    //RESPONSE
    this._isDirty = false;
    this._response = {};

    //CONTROL VARIABLES
    this._alive = true;
    this._lastActionTs = null;

    return this;
};

//region Setters/Getters

Hero2.prototype.getId = function()     {return this._id;};
Hero2.prototype.getSocket = function() {return this._socket;};

Hero2.prototype.getLocation = function()           {return this._location;};
Hero2.prototype.setLocation = function(v)   {this._setValue('_location', v); return this;};

Hero2.prototype.getName = function() { return this._name;};
Hero2.prototype.setName = function(v) { this._setValue('_name', v); return this;};

Hero2.prototype.getLevel = function() { return this._level;};
Hero2.prototype.setLevel = function(v) { this._setValue('_level', v); return this;};

Hero2.prototype.getExp = function() { return this._exp;};
Hero2.prototype.setExp = function(v) { this._setValue('_exp', v); return this;};
Hero2.prototype.addExp = function(v) { this._setValue('_exp', this._exp + v); return this;};

Hero2.prototype.getHp = function() { return this._hp > 0 ? this._hp : 0;};
Hero2.prototype.setHp = function(v) { this._setValue('_hp', (v > 0 ? v : 0)); return this;};
Hero2.prototype.addHp = function(v) { this._setValue('_hp', this._hp + v); return this;};

Hero2.prototype.getAttack = function() { return this._attack;};
Hero2.prototype.setAttack = function(v) { this._setValue('_attack', v); return this; };

Hero2.prototype.getDefence = function() { return this._defence;};
Hero2.prototype.setDefence = function(v) { this._setValue('_defence', v); return this; };

Hero2.prototype.getSpeed = function() { return this._speed;};
Hero2.prototype.setSpeed = function(v) { this._setValue('_speed', v); return this; };

Hero2.prototype.getAttackSpeed = function() { return this._attackSpeed;};
Hero2.prototype.setAttackSpeed = function(v) { this._setValue('_attackSpeed', v); return this; };

Hero2.prototype.getWeight = function() { return this._weight;};
Hero2.prototype.setWeight = function(v) { this._setValue('_weight', v); return this; };

Hero2.prototype.isAlive = function() { return this._alive; };

//endregion Setters/Getters

Hero2.prototype.heroOnDisconnect = function()
{
    var Locations = module.parent.parent.exports.Locations;
    var location = Locations.getLocation(this._location);
    location.removeHeroFromLocation(this.getId());
};

Hero2.prototype._setValue = function(field, value)
{
    this[field] = value;
    if (this._response['hero'] === undefined) {
        this._response['hero'] = {};
    }
    this._response['hero'][field] = value;
    this._isDirty = true;
};

Hero2.prototype.sendResponse = function()
{
    if (this._isDirty) {
        this._socket.emit('hero_response', this._response);
        this._response = {};
        this._isDirty = false;
    }
};

Hero2.prototype.canHeroAction = function()
{
    var now = Date.now();
    var diff = this._weight - this._speed;
    var speedWeight = diff > 1 ? diff * 1000  : 1000;
    return this._lastActionTs + speedWeight <= now;
};

Hero2.prototype.setLastHeroAction = function()
{
    this._lastActionTs = Date.now();
};

Hero2.prototype.isAlive = function()
{
    return this._hp > 0;
};

Hero2.prototype.takeAttack = function(enemy)
{
    var enemyAttack = enemy.getAttack();
    if (enemyAttack > this._defence) {
        var damage = enemyAttack - this._defence;
        var damageDealt = this._hp - damage > 0 ? damage : this._hp;
        this.setHp(this._hp - damageDealt);
    } else if (enemyAttack === this._defence) {
        //luck,
    }

    //dead
    if (this._hp <= 0) {
        this._alive = false;
    }
};

//region DEBUG METHODS
Hero2.prototype.emitError = function(message) {this.getSocket().emit('response_error', {message: message});};
Hero2.prototype.whoAmI =    function() {console.log('Hero', this._id);};
//endregion DEBUG METHODS


var create = function(socket,id)
{
    return new Hero2(socket, id);
};
module.exports = {
    create: create
};

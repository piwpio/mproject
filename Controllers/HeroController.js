var create = function(socket)
{
    return new Hero2(socket);
};
module.exports = {
    create: create
};


var ResponseController = require("./ResponseController");

var Hero2 = function(socket)
{
    ResponseController.call(this, 'hero_response', 'hero');

    //TODO
    this._id = Math.round(Math.random() * 10);
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

    //CONTROL VARIABLES
    this._lastActionTs = null;

    return this;
};
Hero2.prototype = Object.create(ResponseController.prototype);

//region Setters/Getters

Hero2.prototype.getId = function()     {return this._id;};
Hero2.prototype.getSocket = function() {return this._socket;};

Hero2.prototype.getLocation = function()           {return this._location;};
Hero2.prototype.setLocation = function(v, responseId)   {this._setValue(responseId, '_location', v); return this;};

Hero2.prototype.getName = function() { return this._name;};
Hero2.prototype.setName = function(v, responseId) { this._setValue(responseId, '_name', v); return this;};

Hero2.prototype.getLevel = function() { return this._level;};
Hero2.prototype.setLevel = function(v, responseId) { this._setValue(responseId, '_level', v); return this;};

Hero2.prototype.getExp = function() { return this._exp;};
Hero2.prototype.setExp = function(v, responseId) { this._setValue(responseId, '_exp', v); return this;};
Hero2.prototype.addExp = function(v, responseId) { this._setValue(responseId, '_exp', this._exp + v); return this;};

Hero2.prototype.getHp = function() { return this._hp > 0 ? this._hp : 0;};
Hero2.prototype.setHp = function(v, responseId) { this._setValue(responseId, '_hp', (v > 0 ? v : 0)); return this;};
Hero2.prototype.addHp = function(v, responseId) { this._setValue(responseId, '_hp', this._hp + v); return this;};

Hero2.prototype.getAttack = function() { return this._attack;};
Hero2.prototype.setAttack = function(v, responseId) { this._setValue(responseId, '_attack', v); return this; };

Hero2.prototype.getDefence = function() { return this._defence;};
Hero2.prototype.setDefence = function(v, responseId) { this._setValue(responseId, '_defence', v); return this; };

Hero2.prototype.getSpeed = function() { return this._speed;};
Hero2.prototype.setSpeed = function(v, responseId) { this._setValue(responseId, '_speed', v); return this; };

Hero2.prototype.getAttackSpeed = function() { return this._attackSpeed;};
Hero2.prototype.setAttackSpeed = function(v, responseId) { this._setValue(responseId, '_attackSpeed', v); return this; };

Hero2.prototype.getWeight = function() { return this._weight;};
Hero2.prototype.setWeight = function(v, responseId) { this._setValue(responseId, '_weight', v); return this; };

//endregion Setters/Getters

Hero2.prototype.heroOnDisconnect = function()
{
    // var Locations = module.parent.parent.exports.Locations;
    // var location = Locations.getLocation(this._location);
    // location.removeHeroFromLocation(this);
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
    // var damage = enemy.getAttack();
    // if (damage > this._defence) {
    //     this._setValue('hp', this._hp - (damage - this._defence));
    // } else if (damage === this._defence) {
    //     //luck,
    // }
};

//region Debug methods
Hero2.prototype.emitError = function(message) {this._socket.emit('response_error', {message: message});};
Hero2.prototype.whoAmI =    function() {console.log('Hero', this._id);};
//endregion DEBUG METHODS

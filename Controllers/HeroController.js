var Hero2 = function(socket)
{
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

//region Getters

Hero2.prototype.getId = function()     {return this._id;};
Hero2.prototype.getSocket = function() {return this._socket;};

Hero2.prototype.getLocation = function()           {return this._location;};
Hero2.prototype.getName = function() { return this._name;};
Hero2.prototype.getLevel = function() { return this._level;};
Hero2.prototype.getExp = function() { return this._exp;};
Hero2.prototype.getHp = function() { return this._hp > 0 ? this._hp : 0;};
Hero2.prototype.getAttack = function() { return this._attack;};
Hero2.prototype.getDefence = function() { return this._defence;};
Hero2.prototype.getSpeed = function() { return this._speed;};
Hero2.prototype.getWeight = function() { return this._weight;};

//endregion Getters

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

var create = function(socket)
{
    return new Hero2(socket);
};
module.exports = {
    create: create
};

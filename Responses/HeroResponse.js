var Response = require("./Response");

var HeroResponse = function()
{
    Response.call(this, 'hero_response', 'hero');
};
HeroResponse.prototype = Object.create(Response.prototype);

HeroResponse.prototype.createNewHeroResponse = function(hero)
{
    var responseId = hero.getId() + "_" + Date.now();
    this.createNewResponse(responseId, hero.getId());
    return responseId;
};

HeroResponse.prototype.setLocation = function(responseId, v)    { this._responses[responseId]['_location'] =  v; return this;};
HeroResponse.prototype.setName = function(responseId, v)        { this._responses[responseId]['_name'] =  v; return this;};
HeroResponse.prototype.setLevel = function(responseId, v)       { this._responses[responseId]['_level'] =  v; return this;};
HeroResponse.prototype.setExp = function(responseId, v)         { this._responses[responseId]['_exp'] =  v; return this;};
HeroResponse.prototype.setHp = function(responseId, v)          { this._responses[responseId]['_hp'] =  v > 0 ? v : 0; return this;};
HeroResponse.prototype.setAttack = function(responseId, v)      { this._responses[responseId]['_attack'] =  v; return this; };
HeroResponse.prototype.setDefence = function(responseId, v)     { this._responses[responseId]['_defence'] =  v; return this; };
HeroResponse.prototype.setSpeed = function(responseId, v)       { this._responses[responseId]['_speed'] =  v; return this; };
HeroResponse.prototype.setAttackSpeed = function(responseId, v) { this._responses[responseId]['_attackSpeed'] =  v; return this; };
HeroResponse.prototype.setWeight = function(responseId, v)      { this._responses[responseId]['_weight'] =  v; return this; };


var create = function()
{
    return new HeroResponse();
};
module.exports = {
    create: create
};


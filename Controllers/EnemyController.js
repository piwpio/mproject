var create = function(name, lvl, hp, attack, defence, attackSpeed, exp)
{
    return new Enemy2(name, lvl, hp, attack, defence, attackSpeed, exp);
};
module.exports = {
    create: create
};


var Enemy2 = function(name, level, hp, attack, defence, attackSpeed, exp)
{
    this._name = name;
    this._level = level;
    this._hp = hp * level;
    this._attack = attack * level;
    this._defence = defence * level;
    this._attackSpeed = attackSpeed;
    this._exp = exp;

    this._respSeconds = 10 * level;
    this._respTime = null;
    this._alive = true;
    this._maxHp = hp * level;

    this._heroesLastAttackTs = {};
    this._heroesAttackDamage = {};
};

Enemy2.prototype.getName =          function(){ return this._name };
Enemy2.prototype.getLevel =         function(){ return this._level };
Enemy2.prototype.getHp =            function(){ return this._hp };
Enemy2.prototype.getMaxHp =         function(){ return this._maxHp };
Enemy2.prototype.getAttack =        function(){ return this._attack };
Enemy2.prototype.getDefence =       function(){ return this._defence };
Enemy2.prototype.getAttackSpeed =   function(){ return this._attackSpeed };

Enemy2.prototype.isAlive =          function() {return this._alive;};

Enemy2.prototype.takeAttack = function(hero)
{
    var heroId = hero.getId();
    var heroAttack = hero.getAttack();
    //hero last attack ts
    this._heroesLastAttackTs[heroId] = Date.now();
    //hero attack counter
    if (this._heroesAttackDamage[heroId] === undefined) {
        this._heroesAttackDamage[heroId] = 0;
    }

    if (heroAttack > this._defence) {
        var damage = heroAttack - this._defence;
        var damageDealt = this._hp - damage > 0 ? damage : this._hp;
        this._hp -= damage;
        this._heroesAttackDamage[heroId] += damageDealt;

    } else if (heroAttack === this._defence) {
        //luck,
    }

    if (this._hp <= 0) {
        this._respTime = Date.now() + this._respSeconds;
        this._alive = false;
    }
};

Enemy2.prototype.getHeroesWhichAttacked = function()
{
    return this._heroesAttackDamage;
};

Enemy2.prototype.respawn = function()
{
    this._respTime = null;
    this._alive = true;
};

Enemy2.prototype.cleanAferDeath = function()
{
    this._heroesLastAttackTs = {};
    this._heroesAttackDamage = {};
    this._respTime = Date.now() + (this._respSeconds * 1000);
};

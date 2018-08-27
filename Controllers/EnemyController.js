var create = function(id, base, name, lvl, hp, attack, defence, attackSpeed, exp)
{
    return new Enemy2(id, base, name, lvl, hp, attack, defence, attackSpeed, exp);
};
module.exports = {
    create: create
};


var Enemy2 = function(id, base, name, level, hp, attack, defence, attackLag, exp)
{
    this._id = id;
    this._base = base;
    this._location = null;
    this._name = name;
    this._level = level;
    this._hp = hp * level;
    this._attack = attack * level;
    this._defence = defence * level;
    this._attackLag = attackLag;
    this._exp = exp;

    this._respSeconds = 10 * level;
    this._respTime = null;
    this._deathTime = null;
    this._alive = true;
    this._baseHp = hp * level;

    //RESPONSE
    this._response = {};

    this._lastAttackActionTs = 0;
    this._heroesAttackDamage = {};
    this._heroesAttackedOrder = [];
};

Enemy2.prototype._setValue = function(field, value)
{
    this[field] = value;
    this._response[field] = value;
};
Enemy2.prototype.getResponse = function()
{
    return this._response;
};
Enemy2.prototype.cleanResponse = function()
{
    this._response = {};
};

Enemy2.prototype.getEnemyViewForOtherHero = function()
{
    return {
        id: this._id,
        base: this._base,
        name: this._name
    }
};

Enemy2.prototype.getId =            function(){ return this._id };
Enemy2.prototype.getLocation =      function(){ return this._location };
Enemy2.prototype.getName =          function(){ return this._name };
Enemy2.prototype.getLevel =         function(){ return this._level };
Enemy2.prototype.getHp =            function(){ return this._hp };
Enemy2.prototype.getBaseHp =        function(){ return this._baseHp };
Enemy2.prototype.getAttack =        function(){ return this._attack };
Enemy2.prototype.getDefence =       function(){ return this._defence };
Enemy2.prototype.getAttackSpeed =   function(){ return this._attackLag };
Enemy2.prototype.getExp =           function(){ return this._exp };
Enemy2.prototype.getRespTime =      function(){ return this._respTime };
Enemy2.prototype.getDeathTime =     function(){ return this._deathTime };

Enemy2.prototype.setLocation =  function(v) { this._location = v; return this; };
Enemy2.prototype.setHp =        function(v) { this._setValue('_hp', v); return this;};

Enemy2.prototype.isAlive =          function() {return this._alive;};

Enemy2.prototype.canRespawn = function()
{
    return this.getRespTime() <= Date.now();
};

Enemy2.prototype.takeAttack = function(hero)
{
    var heroId = hero.getId();
    var heroAttack = hero.getAttack();
    this._addAttacker(hero.getId());
    //hero attack counter
    if (this._heroesAttackDamage[heroId] === undefined) {
        this._heroesAttackDamage[heroId] = 0;
    }

    if (heroAttack > this._defence) {
        var damage = heroAttack - this._defence;
        var damageDealt = this._hp - damage > 0 ? damage : this._hp;
        this.setHp(this._hp - damage);
        this._heroesAttackDamage[heroId] += damageDealt;

    } else if (heroAttack === this._defence) {
        //luck,
    }

    if (this._hp <= 0) {
        console.log('enemy dead');
        this._deathTime = Date.now();
        this._respTime = this._deathTime + (this._respSeconds * 1000);
        this._alive = false;
    }
};

Enemy2.prototype.getHeroesWhichAttackedDamage = function()
{
    return this._heroesAttackDamage;
};

Enemy2.prototype._addAttacker = function(heroId)
{
    if (this._heroesAttackedOrder.indexOf(heroId) === -1) {
        this._heroesAttackedOrder.push(heroId)
    }
};

Enemy2.prototype._removeFirstAttacker = function()
{
    this._heroesAttackedOrder.shift();
};

Enemy2.prototype.cronAction = function()
{
    // console.log('enemy cron');
    if (!this.isAlive()) {
        // console.log('r ', Date.now(), this._respTime, Date.now() >= this._respTime);
        // console.log('check if enemy can respawn');
        if (this.canRespawn()) {
            console.log('enemy respawn');
            let LocationsInstance = module.parent.parent.exports.Locations;
            let location = LocationsInstance.getLocation(this._location);

            let EnemyQueueInstance = module.parent.parent.exports.EnemiesQueue;
            EnemyQueueInstance.removeFromQueue(this._id);
            this.respawnAction();
        }
        // check respawn
    } else if (this._canEnemyAttackAction()) {
        // console.log('cron action enemy ' + this.getId() + ' on location ' + this.getLocation());
        let EnemyQueueInstance = module.parent.parent.exports.EnemiesQueue;
        if (this._heroesAttackedOrder[0] === undefined) {
            // console.log('empty attackers order, remove from queue');
            EnemyQueueInstance.removeFromQueue(this._id);

        } else {
            let LocationsInstance = module.parent.parent.exports.Locations;
            let location = LocationsInstance.getLocation(this._location);

            let firstAttackerId = null;
            while (this._heroesAttackedOrder.length) {
                firstAttackerId = this._heroesAttackedOrder[0];
                if (location.isHeroOnLocation(firstAttackerId)) {
                    // console.log('found hero, now attack');
                    break;
                } else {
                    this._removeFirstAttacker();
                    firstAttackerId = null;
                }
            }
            if (!firstAttackerId) {
                // console.log('nie ma herosa który atakował na lokacji');
                EnemyQueueInstance.removeFromQueue(this._id);

            } else {
                console.log('enemy ' + this.getId() + ' attack hero ' + firstAttackerId);
                let attacker = location.getHeroOnLocation(firstAttackerId);
                attacker.takeAttack(this);
                attacker.sendResponse();
                this.setLastEnemyAttackAction();
            }

        }
    } else {
        console.log('cant enemy do attack action yet')
    }

};

Enemy2.prototype._canEnemyAttackAction = function()
{
    return this._lastAttackActionTs <= Date.now();
};

Enemy2.prototype.setLastEnemyAttackAction = function()
{
    this._lastAttackActionTs = Date.now() + (this._attackLag * 1000);
};

Enemy2.prototype.respawnAction = function()
{
    this._deathTime = null;
    this._respTime = null;
    this._heroesAttackDamage = {};
    this._heroesAttackedOrder = [];
    this._hp = this.getBaseHp();

    this._alive = true;
};

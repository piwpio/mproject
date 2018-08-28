var create = function(id, base, name, lvl, coward, hp, attack, defence, attackSpeed, exp,)
{
    return new Enemy2(id, base, name, lvl, coward, hp, attack, defence, attackSpeed, exp);
};
module.exports = {
    create: create
};


var Enemy2 = function(id, base, name, level, coward, hp, attack, defence, attackLag, exp)
{
    this._id = id;
    this._base = base;
    this._location = null;
    this._name = name;
    this._level = level;
    this._coward = coward;
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
Enemy2.prototype.setIsAlive =   function(v) { this._setValue('_alive', v); return this;};

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
        this._deathTime = Date.now();
        this._respTime = this._deathTime + (this._respSeconds * 1000);
        this.setIsAlive(false)
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

Enemy2.prototype.shouldRunAway = function()
{
    let hpPercent = Math.ceil((this._hp / this._baseHp) * 100);
    return this._coward && hpPercent < this._coward
};

Enemy2.prototype.cronAction = function()
{
    let EnemyQueueInstance = module.parent.parent.exports.EnemiesQueue;
    let LocationsInstance = module.parent.parent.exports.Locations;
    let location = LocationsInstance.getLocation(this._location);

    //NOTE check respawn
    if (!this.isAlive()) {
        if (this.canRespawn()) {
            //NOTE enemy respawn
            EnemyQueueInstance.removeFromQueue(this._id);
            this.respawnAction();
            location.broadcastEnemy(this._id);
        }
        return;
    }

    //NOTE run away
    if (this.shouldRunAway()) {
        let newLocationId = 0;
        let canGo = [location.canGoEast(), location.canGoWest()];
        let side;
        if (canGo[0] && canGo[1]) {
            let rand = Math.round(Math.random());
            newLocationId = rand ? location.getWestLocationId() : location.getEastLocationId() ;
            side = rand ? 'west' : 'east';
        } else if (canGo[0]) {
            newLocationId = location.getEastLocationId();
            side = 'east';
        } else if (canGo[1]) {
            newLocationId = location.getWestLocationId();
            side = 'west';
        }

        let newLocation = LocationsInstance.getLocation(newLocationId);
        if (newLocation.canEnemyMoveToLocation()) {
            this.setLocation(newLocationId);
            location.removeEnemyFromLocation(this._id);
            location.broadcastResponse(0, {
                enemy_remove: {
                    id: this.getId(),
                    side: side
                }
            });
            newLocation.addEnemyToLocation(this._id);
            newLocation.broadcastResponse(0, {
                enemy_add: {
                    enemy: this.getEnemyViewForOtherHero(),
                    side: side === 'west' ? 'east' : 'west'
                }
            });

            EnemyQueueInstance.removeFromQueue(this._id);
            return false;
        }
    }

    //NOTE try attack
    if (this._canEnemyAttackAction()) {
        let EnemyQueueInstance = module.parent.parent.exports.EnemiesQueue;
        if (this._heroesAttackedOrder[0] === undefined) {
            //NOTE empty attackers order, remove from queue
            EnemyQueueInstance.removeFromQueue(this._id);

        } else {
            let firstAttackerId = null;
            while (this._heroesAttackedOrder.length) {
                firstAttackerId = this._heroesAttackedOrder[0];
                if (location.isHeroOnLocation(firstAttackerId)) {
                    break;
                } else {
                    this._removeFirstAttacker();
                    firstAttackerId = null;
                }
            }
            if (!firstAttackerId) {
                //NOTE hero is coward and run away from location attack
                EnemyQueueInstance.removeFromQueue(this._id);

            } else {
                //NOTE enemy attack
                let attacker = location.getHeroOnLocation(firstAttackerId);
                attacker.takeAttack(this);
                attacker.sendResponse();
                location.broadcastEnemy(this._id, {attack_hero: firstAttackerId});
                this.setLastEnemyAttackAction();
            }
        }
    } else {
        // console.log('cant enemy do attack action yet')
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
    this.setHp(this._baseHp);
    this.setIsAlive(true);
};

var init = function(name, lvl, hp, attack, defence, attackSpeed, exp)
{
    return new Enemy(name, lvl, hp, attack, defence, attackSpeed, exp);
};

var Enemy = function(name, level, hp, attack, defence, attackSpeed, exp)
{
    var self = this;

    self.name = name;
    self.level = level;
    self.hp = hp * level;
    self.attack = attack * level;
    self.defence = defence * level;
    self.attackSpeed = attackSpeed;
    self.exp = exp;

    self.respSeconds = 10 * level;
    self.respTime = null;
    self.alive = true;
    self.maxHp = hp * level;

    self.heroesLastAttackTs = {};
    self.heroesAttackDamage = {};

    self.name = name;
    self.level = level;
    self.hp = hp * level;
    self.attack = attack * level;
    self.defence = defence * level;
    self.attackSpeed = attackSpeed;

    self.getName =          function(){ return self.name };
    self.getLevel =         function(){ return self.level };
    self.getHp =            function(){ return self.hp };
    self.getMaxHp =         function(){ return self.maxHp };
    self.getAttack =        function(){ return self.attack };
    self.getDefence =       function(){ return self.defence };
    self.getAttackSpeed =   function(){ return self.attackSpeed };

    self.isAlive = function()
    {
        return self.alive;
    };

    self.takeAttack = function(hero)
    {
        var heroId = hero.getId();
        var heroAttack = hero.getAttack();
        //hero last attack ts
        self.heroesLastAttackTs[heroId] = Date.now();
        //hero attack counter
        if (self.heroesAttackDamage[heroId] === undefined) {
            self.heroesAttackDamage[heroId] = 0;
        }

        if (heroAttack > self.defence) {
            var damage = heroAttack - self.defence;
            var damageDealt = self.hp - damage > 0 ? damage : self.hp;
            self.hp -= damage;
            self.heroesAttackDamage[heroId] += damageDealt;

        } else if (heroAttack === self.defence) {
            //luck,
        }

        if (self.hp <= 0) {
            self.respTime = Date.now() + self.respSeconds;
            self.alive = false;
        }
    };

    self.getHeroesWhichAttacked = function()
    {
        return self.heroesAttackDamage;
    };

    self.respawn = function()
    {
        self.respTime = null;
        self.alive = true;
    };

    self.cleanAferDeath = function()
    {
        self.heroesLastAttackTs = {};
        self.heroesAttackDamage = {};
        self.respTime = Date.now() + (self.respSeconds * 1000);
    }
};

module.exports = {
    init: init
};

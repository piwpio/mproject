var init = function(name, lvl, hp, attack, defence)
{
    return new Enemy(name, lvl, hp, attack, defence);
};

var Enemy = function(name, lvl, hp, attack, defence)
{
    var self = this;

    self.name = name;
    self.lvl = lvl;
    self.hp = hp * lvl;
    self.attack = attack * lvl;
    self.defence = defence * lvl;
    self.respSeconds = 10 * lvl;
    self.respTime = null;

    self.heroesLastAttack = {};

    self.getHp =        function(){ return self.hp};
    self.getAttack =    function(){ return self.attack};

    self.isAlive = function()
    {
        return self.hp > 0;
    };

    self.canHeroAttack = function(heroId, heroAttackSpeed)
    {
        heroAttackSpeed = heroAttackSpeed * 1000;
        return self.heroesLastAttack[heroId] === undefined ||
            self.heroesLastAttack[heroId] + heroAttackSpeed < Date.now();
    };

    self.takeAttack = function(heroId, attack)
    {
        self.heroesLastAttack[heroId] = Date.now();
        if (attack > self.defence) {
            self.hp -= (attack - self.defence);
        }
    };

    self.cleanAferDeath = function()
    {
        self.heroesLastAttack = {};
        self.respTime = Date.now() + (self.respSeconds * 1000);
    }
};

module.exports = {
    init: init
};

var Hero = require("./HeroController");

Heroes2 = function()
{
    this.heroes = {};
};

Heroes2.prototype.getHero =     function(id) { return this.heroes[id]; };
Heroes2.prototype.getHeroes =   function() { return this.heroes; };
Heroes2.prototype.addHero =     function(hero) { this.heroes[hero.getId()] = hero; };
Heroes2.prototype.removeHero =  function(heroId) { delete this.heroes[heroId]; };

Heroes2.prototype.createHero = function(socket)
{
    //CONNECT HERO INIT ETC
    var hero = Hero.create(socket);

    socket._heroId = hero.getId();
    socket.getHeroId = function() {return this._heroId};

    this.addHero(hero);
    socket.emit('connected');

    //DISCONNECT
    var self = this;
    socket.on('disconnect', function() {
        self.removeHero(socket.getHeroId());
        hero.heroOnDisconnect();
        console.log("HERO " + socket.getHeroId() + " DISCONNECTED")
    });
};

Heroes2.prototype.debugShowHeroes = function()
{
    var total = 0;
    for(var key in this.heroes) {
        total++;
        var hero = this.heroes[key];
        console.log("Hero: " + hero.getId(), "Location: " + hero.getLocation());
    }
    console.log("Total heroes: " + total);
};


var create = function()
{
    return new Heroes2();
};
module.exports = {
    create,
};

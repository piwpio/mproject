var Hero = require("./HeroController");

var HeroesInstance = undefined;
var init = function()
{
    if (HeroesInstance === undefined) {
        HeroesInstance = (new Heroes()).init();
    }
    return HeroesInstance;
};
var getInstance = function()
{
    return HeroesInstance;
};

var Heroes = function()
{
    var self = this;

    var HEROES = null;

    self.init = function()
    {
        HEROES = {};
        return self;
    };

    self.initHeroConnect = function(socket)
    {
        //connect, init hero etc
        var hero = Hero.init(socket);

        socket._heroId = hero.getId();
        socket.getHeroId = function() {return this._heroId};

        self.addHero(hero);
        socket.emit('connected');

        //disconnect
        socket.on('disconnect', function() {
            self.removeHero(socket.getHeroId());
            console.log("HERO " + socket.getHeroId() + " DISCONNECTED")
        });
    };

    self.addHero = function(hero)
    {
        HEROES[hero.getId()] = hero;
    };

    self.removeHero = function(heroId)
    {
        delete HEROES[heroId];
    };

    self.getHero = function(id)
    {
        return HEROES[id];
    };

    //region debug methods
    self.debugShowHeroes = function()
    {
        var total = 0;
        for(var key in HEROES) {
            total++;
            var hero = HEROES[key];
            console.log("Hero: " + hero.getId(), "Location: " + hero.getLocation())
        }
        console.log("Total heroes: " + total);
    };
    //endregion debug methods
};

module.exports = {
    init,
    getInstance
};

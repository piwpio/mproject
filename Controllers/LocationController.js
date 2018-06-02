var init = function(locationData)
{
    return (new Location).init(
        locationData.id,
        locationData.t,
        locationData.m,
        locationData.e
    );
};

var Location = function()
{
    var self = this;

    self.id = null;
    self.terrain = null;
    self.moves = null;
    self.enemies = null;
    self.heroesOnLocation = null;

    self.init = function(id, terrain, moves, enemies)
    {
        self.id = id;
        self.terrain = terrain;
        self.moves = moves;
        self.enemies = enemies;
        self.heroesOnLocation = {};

        return self;
    };

    self.canGoLeft = function()
    {
        return self.moves[0] !== null
    };
    self.canGoRight = function()
    {
        return self.moves[1] !== null
    };

    self.getLeftLocationId = function()
    {
        return self.moves[0];
    };
    self.getRightLocationId = function()
    {
        return self.moves[1];
    };

    self.addHeroToLocation = function(hero)
    {
        //send heroes on new location info, that hero just moved to this location
        self.heroesOnLocation[hero.getId()] = 1;
        var HeroesInstance = module.parent.parent.exports.Heroes;
        for (var heroId in self.heroesOnLocation) {
            if (hero.getId() == heroId) {
                continue;
            }
            HeroesInstance
                .getHero(heroId)
                .responseAddKey('location', {
                    addhero: hero.id
                })
                .sendResponse();
        }
    };
    self.removeHeroFromLocation = function(hero)
    {
        //send heroes on current location info, that hero just moved from this location
        delete self.heroesOnLocation[hero.getId()];
        var HeroesInstance = module.parent.parent.exports.Heroes;
        for (var heroId in self.heroesOnLocation) {
            if (hero.getId() == heroId) {
                continue;
            }
            HeroesInstance
                .getHero(heroId)
                .responseAddKey('location', {
                    rmhero: hero.id
                })
                .sendResponse();
        }
    };

    self.getHeroesOnLocation = function()
    {
        return self.heroesOnLocation;
    }
};

module.exports = {
    init: init
};

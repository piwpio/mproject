var Debug = function() {};

Debug.prototype.addHeroDebug = function(socket)
{
    socket.on('debug_logged_show_heroes', function() {
        let HeroesInstance = module.parent.exports.Heroes;
        HeroesInstance.debugShowHeroes();
    });
    socket.on('debug_hero_who', function(){
        let HeroesInstance = module.parent.exports.Heroes;
        HeroesInstance.getHero(socket.getHeroId()).whoAmI();
    });
};

var create = function()
{
    return new Debug();
};
module.exports = {
    create: create
};
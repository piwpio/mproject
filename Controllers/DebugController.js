var Heroes = require("./HeroesController");

var DebugInstance = undefined;
var init = function()
{
    if (DebugInstance === undefined) {
        DebugInstance = (new Debug()).init();
    }
    return DebugInstance;
};
var getInstance = function()
{
    return DebugInstance;
};

var Debug = function()
{
    var self = this;

    this.init = function()
    {
        return self;
    };

    this.addHeroDebug = function(socket)
    {
        socket.on('debug_logged_show_heroes', function() {
            Heroes.getInstance().debugShowHeroes();
        });
        socket.on('debug_hero_who', function(){
            Heroes.getInstance().getHero(socket.getHeroId()).whoAmI();
        });
    }
};

//region Exports

module.exports = {
    init,
    getInstance
};

//endregion Exports
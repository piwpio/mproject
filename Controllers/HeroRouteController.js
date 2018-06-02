var MoveLeftModel = require("../Models/MoveLeftModel");
var MoveRightModel = require("../Models/MoveRightModel");
var InitHeronModel = require("../Models/InitHeroModel");

var init = function(hero)
{
    var socket = hero.getSocket();
    //Hero movement
    socket.on('move_left',  function(){MoveLeftModel.execute(hero)});
    socket.on('move_right', function(){MoveRightModel.execute(hero)});
    socket.on('init_hero', function(){InitHeronModel.execute(hero)});
};

module.exports = {
    init
};

var MoveLeftModel = require("../Models/MoveLeftModel");
var MoveRightModel = require("../Models/MoveRightModel");

var init = function(hero)
{
    var socket = hero.getSocket();
    //Hero movement
    socket.on('move_left',  function(){MoveLeftModel.execute(hero)});
    socket.on('move_right', function(){MoveRightModel.execute(hero)});
};

module.exports = {
    init
};

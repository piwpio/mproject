var MoveLeftModel = require("../Models/MoveLeftModel");
var MoveRightModel = require("../Models/MoveRightModel");
var InitHeroModel = require("../Models/InitHeroModel");
var ChatMessageModel = require("../Models/ChatMessageModel");

var init = function(hero)
{
    var socket = hero.getSocket();
    socket.on('init_hero', function(){InitHeroModel.execute(hero)});
    //Hero movement
    socket.on('move_left',  function(){MoveLeftModel.execute(hero)});
    socket.on('move_right', function(){MoveRightModel.execute(hero)});
    //Hero chat
    socket.on('chat_message', function(d){ChatMessageModel.execute(hero, d.m)});
};

module.exports = {
    init
};

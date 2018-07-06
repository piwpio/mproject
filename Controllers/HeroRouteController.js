var MoveLeftModel = require("../Models/MoveLeftModel");
var MoveRightModel = require("../Models/MoveRightModel");
var InitHeroModel = require("../Models/InitHeroModel");
var ChatMessageModel = require("../Models/ChatMessageModel");
var FightAttackModel = require("../Models/FightAttackModel");

var init = function(hero)
{
    var socket = hero.getSocket();
    socket.on('init_hero', function(){InitHeroModel.execute(hero)});
    //Hero movement
    socket.on('move_left',  function(){MoveLeftModel.execute(hero)});
    socket.on('move_right', function(){MoveRightModel.execute(hero)});
    //Hero chat
    socket.on('chat_message', function(d){ChatMessageModel.execute(hero, d.m)});
    //Hero fight
    socket.on('fight_attack', function(){FightAttackModel.execute(hero)});
};

module.exports = {
    init
};

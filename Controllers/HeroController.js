var Hero = function ()
{
    var self = this;

    //main control varibles
    self.socket = null;
    self.id = null;

    //specific hero game variables
    self.location = null;

    self.name = null;
    self.level = null;
    self.hp = null;
    self.attack = null;
    self.defence = null;
    self.speed = null;
    self.attackSpeed = null;
    self.weight = null;

    self.heroOnConnect = function(socket)
    {
        //TODO
        self.id = Math.round(Math.random() * 10);
        self.socket = socket;
        self.lastActionTs = Date.now() - 10000;

        //TODO
        self.location = 1;

        //TODO
        self.name = 'Warrior';
        self.level = 1;
        self.exp = 0;
        self.hp = 10;
        self.attack = 3;
        self.defence = 1;
        self.speed = 1;
        self.attackSpeed = 1;
        self.weight = 3;

        return self;
    };

    self.heroOnDisconnect = function()
    {
        var Locations = module.parent.parent.exports.Locations;
        var location = Locations.getLocation(self.location);
        location.removeHeroFromLocation(self);
    };

    //region Response
    self.isDirty = false;
    self.response = {};
    self.setValue = function(field, value)
    {
      self[field] = value;
      if (!self.response.hasOwnProperty('h')) {
          self.response['h'] = {};
      }
      self.response['h'][field] = value;
      self.isDirty = true;
    };

    self.sendResponse = function()
    {
        if (self.isDirty) {
            self.socket.emit('response', self.response);
            self.response = {};
            self.isDirty = false;
        }
    };

    self.responseAddKey = function(key, data)
    {
        if (!self.response.hasOwnProperty(key)) {
            self.response[key] = data;
            self.isDirty = true;
        } else {
            console.log('ERROR, HERO RESPONSE HAVE THIS VIEW ALREADY');
            console.log("OLD", self.response[key]);
            console.log("NEW", data);
        }

        return self;
    };

    //endregion Response

    //region Setters/Getters
    self.getId = function()     {return self.id;};
    self.getSocket = function() {return self.socket;};

    self.getLocation = function()           {return self.location;};
    self.setLocation = function(location)   {self.setValue('location', location); return self;};

    self.getName = function() { return self.name;};
    self.setName = function(v) { self.setValue('name', v); return self;};

    self.getLevel = function() { return self.level;};
    self.setLevel = function(v) { self.setValue('level', v); return self;};

    self.getExp = function() { return self.exp;};
    self.setExp = function(v) { self.setValue('exp', v); return self;};
    self.addExp = function(v) { self.setValue('exp', self.exp + v); return self;};

    self.getHp = function() { return self.hp > 0 ? self.hp : 0;};
    self.setHp = function(v) { self.setValue('hp', (v > 0 ? v : 0)); return self;};
    self.addHp = function(v) { self.setValue('hp', self.hp + v); return self;};

    self.getAttack = function() { return self.attack;};
    self.setAttack = function(v) { self.setValue('attack', v); return self; };

    self.getDefence = function() { return self.defence;};
    self.setDefence = function(v) { self.setValue('defence', v); return self; };

    self.getSpeed = function() { return self.speed;};
    self.setSpeed = function(v) { self.setValue('speed', v); return self; };

    self.getAttackSpeed = function() { return self.attackSpeed;};
    self.setAttackSpeed = function(v) { self.setValue('attackSpeed', v); return self; };

    self.getWeight = function() { return self.weight;};
    self.setWeight = function(v) { self.setValue('weight', v); return self; };

    //endregion Setters/Getters
    self.lastActionTs = null;
    self.canHeroAction = function()
    {
        var now = Date.now();
        var diff = self.weight - self.speed;
        var speedWeight = diff > 1 ? diff * 1000  : 1000;
        return self.lastActionTs + speedWeight <= now;
    };

    self.setLastHeroAction = function()
    {
        self.lastActionTs = Date.now();
    };

    self.isAlive = function()
    {
        return self.hp > 0;
    };

    self.takeAttack = function(enemy)
    {
        var damage = enemy.getAttack();
        if (damage > self.defence) {
            self.setValue('hp', self.hp - (damage - self.defence));
        } else if (damage === self.defence) {
            //luck,
        }
    };

    //region Debug methods
    self.emitError = function(message)
    {
        self.socket.emit('response_error', {message: message});
    };

    self.whoAmI = function()
    {
        console.log('Hero', self.id);
    }
    //endregion Debug methods
};

var init = function(socket)
{
    return (new Hero).heroOnConnect(socket);
};

module.exports = {
    init: init
};

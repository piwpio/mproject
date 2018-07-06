var Hero = function ()
{
    var self = this;

    //main control varibles
    self.socket = null;
    self.id = null;

    //specific hero game variables
    self.location = null;

    self.heroOnConnect = function(socket)
    {
        //TODO
        self.id = Math.round(Math.random() * 10);
        self.socket = socket;

        //TODO
        self.location = 1;

        return self;
    };

    self.heroOnDisconnect = function()
    {
        var Locations = module.parent.parent.exports.Locations;
        var location = Locations.getLocation(self.location);
        location.removeHeroFromLocation(self);
    };

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

    //region Setters/Getters
    self.getId = function()     {return self.id;};
    self.getSocket = function() {return self.socket;};

    self.getLocation = function()           {return self.location;};
    self.setLocation = function(location)   {self.setValue('location', location); return self;};
    //endregion Setters/Getters

    self.getAttack = function() { return 3;};
    self.getAttackSpeed = function() { return 3;};

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

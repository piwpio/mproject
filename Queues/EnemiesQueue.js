var Queue = function()
{
    this._queue = {};
};

Queue.prototype.addToQueue = function(enemyId)
{
    this._queue[enemyId] = 1;
    return this;
};

Queue.prototype.removeFromQueue = function(enemyId)
{
    delete this._queue[enemyId];
    return this;
};

module.exports = Queue;

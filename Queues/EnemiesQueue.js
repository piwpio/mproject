var EnemyQueue = function()
{
    this._queue = {};
};

EnemyQueue.prototype.addToQueue = function(enemyId)
{
    this._queue[enemyId] = 1;
    return this;
};

EnemyQueue.prototype.removeFromQueue = function(enemyId)
{
    delete this._queue[enemyId];
    return this;
};

EnemyQueue.prototype.isEnemyInQueue = function(enemyId)
{
    return !!this._queue[enemyId];
};

EnemyQueue.prototype.getQueue = function()
{
    return this._queue;
};

module.exports = {
    create: function() { return new EnemyQueue(); }
};

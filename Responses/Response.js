var Response = function(responseEmitKey)
{
    this._responseEmitKey = responseEmitKey;

    this._responses = {};
    this._responseReadyQueue = [];
    this._responseOwners = {};
};

Response.prototype.getResponse = function(responseId)
{
    return this._responses[responseId];
};

Response.prototype.getEmitKey = function()
{
    return this._responseEmitKey;
};

Response.prototype.getQueue = function()
{
    return this._responseReadyQueue;
};

Response.prototype.getResponseOwner = function(responseId)
{
    return this._responseOwners[responseId];
};

Response.prototype.createNewResponse = function(responseId, ownerId)
{
    this._responses[responseId] = {};
    this._responseOwners[responseId] = ownerId
};

Response.prototype.closeResponse = function(responseId)
{
    this._responseReadyQueue.push(responseId);
};

Response.prototype.sendResponse = function(responseId, socket)
{
    delete this._responsesReady[responseId];
    if (socket !== undefined) {
        socket.emit(this._responseEmitKey, this._responses[responseId]);
    }
    delete this._responses[responseId];
    delete this._responsesTriggeredBy[responseId];
};

Response.prototype.broadcastResponse = function(responseId, socketsArr)
{
    this._responsesReady[responseId] = false;
    if (socketsArr !== undefined && socketsArr.length > 0) {
        for (var socket of socketsArr) {
            if (socket._heroId !== this._responsesTriggeredBy[responseId]) {
                socket.emit(this._responseEmitKey, this._responses[responseId]);
            }
        }
    }
    delete this._responsesReady[responseId];
    delete this._responses[responseId];
    delete this._responsesTriggeredBy[responseId];
};

module.exports = Response;
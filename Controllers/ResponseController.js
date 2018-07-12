var ReponseController = function(responseEmitKey, responseKey)
{
    this._responseKey = responseKey;
    this._responseEmitKey = responseEmitKey;

    this._responses = {};
    this._responsesReady = {};
    this._responsesTriggeredBy = {};
};

ReponseController.prototype.getResponseKey = function()
{
    return this._responseKey;
};

ReponseController.prototype.createNewResponse = function()
{
    var responseId = this.getId() + "_" + Date.now();
    this._responses[responseId] = {};
    return responseId;
};

ReponseController.prototype.closeResponse = function(responseId)
{
    this._responsesReady[responseId] = true;
};

ReponseController.prototype.responseAddKey = function(responseId, key, value)
{
    this._responses[responseId][key] = value;
};

ReponseController.prototype.getResponses = function()
{
    return this._responses;
};

ReponseController.prototype.getResponsesReady = function()
{
    return this._responsesReady;
};

ReponseController.prototype.setResponseTriggeredBy = function(responseId, triggeredBy)
{
    this._responsesTriggeredBy[responseId] = triggeredBy;
};

ReponseController.prototype.getResponseTriggeredBy = function(responseId)
{
    return this._responsesTriggeredBy[responseId] || 0;
};

ReponseController.prototype.getResponse = function(responseId)
{
    return this._responses[responseId] || null;
};

ReponseController.prototype._setValue = function(responseId, field, value)
{
    this[field] = value;
    if (this._responses[responseId][this._responseKey] === undefined) {
        this._responses[responseId][this._responseKey] = {};
    }
    this._responses[responseId][this._responseKey][field] = value;
};

ReponseController.prototype.sendResponse = function(responseId, socket)
{
    delete this._responsesReady[responseId];
    if (socket === undefined) {
        socket = this._socket;
    }
    socket.emit(this._responseEmitKey, this._responses[responseId]);
    delete this._responses[responseId];
    delete this._responsesTriggeredBy[responseId];
};

ReponseController.prototype.broadcastResponse = function(responseId, socketsArr)
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

module.exports = ReponseController;
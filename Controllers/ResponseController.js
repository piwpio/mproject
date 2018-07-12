var ReponseController = function(responseEmitKey, responseKey)
{
    this._responseKey = responseKey;
    this._responseEmitKey = responseEmitKey;
};

ReponseController.prototype._setValue = function(field, value)
{
    this[field] = value;
    if (this._response[this._responseKey] === undefined) {
        this._response[this._responseKey] = {};
    }
    this._response[this._responseKey][field] = value;
    this._isDirty = true;
};

ReponseController.prototype.sendResponse = function()
{
    if (this._isDirty) {
        this._socket.emit(this._responseEmitKey, this._response);
        this._response = {};
        this._isDirty = false;
    }
};
module.exports = ReponseController;
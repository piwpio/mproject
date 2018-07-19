var socket = io();
socket.on('connected', function() {
    $('#loading').hide();
    $('#loaded').show();
    socket.emit('init_hero')
});
socket.on('chat_response', function(r) {
    console.log(r);
});
socket.on('hero_response', function(r) {
    console.log(r);
});
socket.on('location_response', function(r) {
    console.log(r);
    if (r['chat'] !== undefined) {
        $("#chat").append("<span style='display:block;'><b>" + r['chat'][0] + ": </b>" + r['chat'][1] + "</span>");
    }
});

socket.on('response_error', function(error) {
    console.log('response_error', error.message);
});

function left()
{
    socket.emit('move_left');
}

function right()
{
    socket.emit('move_right');
}

function attack()
{
    socket.emit('fight_attack', {eid: 0, et: 'm'});
}

function showHeroes()
{
    socket.emit('debug_logged_show_heroes', function(d) {
        console.log(d);
    });
}
function who()
{
    socket.emit('debug_hero_who');
}

// window.intervalId = setInterval(function() {
//     attack();
// }, 1000);

$(function() {
    $("#message-form").on("submit", function(e) {
        e.preventDefault();
        var messageInput = $("#message-input");
        var message = messageInput.val();
        socket.emit('chat_message', {m: message});
        $("#chat").append(
            "<span style='display:block'><b>me: </b>" + message + "</span>"
        );
        messageInput.val("");
        return false;
    });
});
// level: 1,
// hp: 10,
// attack: 2,
// defence: 1,
// attack_speed: 1,
// exp: 10,
var raw = {
    1: {base: 'wolf',},
    2: {base: 'wolf', level: 1},
    3: {base: 'wolf', level: 1},
    4: {base: 'wolf', level: 2, exp: 11},
};

module.exports = {
    getAll: function() { return raw; }
};